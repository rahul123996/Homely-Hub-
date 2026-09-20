// receive the uer infromation 
// validate the required infromation
// send the infromation to out AI trip planner
//claculate the budget per night
// search Mongodb for suitable properties
// send both ai atrip plan + matching properties back to frontend / user


import { Property } from "../Models/propertyModel.js";
import { planTrip } from "../ai/tripPlanner.js";
import { generateDescription } from "../ai/generateDescription.js";

const cleanCity = (text) => text ? text.toLowerCase().replaceAll(" ", "") : "";

const createTripPlan = async (req, res) => {
    try {
        const { destination, days, people, budget, interests } = req.body;

        if (!destination || !days || !people || !budget) {
            return res.status(400).json({
                status: "fail",
                message: "Please fill in destination, budget, days, and people"
            });
        }

        const safeInterests = Array.isArray(interests)
            ? interests
            : typeof interests === "string" && interests.trim() !== ""
            ? interests.split(",").map((s) => s.trim())
            : [];

        const plan = await planTrip({
            destination,
            budget,
            days,
            people,
            interests: safeInterests
        });

        const perNight = Number(budget) / Number(days);

        const city = cleanCity(destination);
        const cityRegex = city ? new RegExp(city, "i") : /.*/;

        const properties = await Property.find({
            $or: [
                { "address.city": cityRegex },
                { "address.state": cityRegex },
                { "address.area": cityRegex }
            ],
            price: { $lte: perNight },
            maximumGuest: { $gte: Number(people) }
        }).limit(6);

        res.status(200).json({
            status: "success",
            data: { plan, properties, perNight }
        });

    } catch (error) {
        console.error("Error creating trip plan:", error);
        res.status(500).json({
            status: "fail",
            message: "Could not create a trip plan, please try again "
        });
    }
};


const writeDescription = async (req, res) => {
    try {
        const description = await generateDescription(req.body);

        res.status(200).json({ status: "success", data: { description } });

    } catch (error) {
        console.error("Error generating description:", error);
        res.status(500).json({
            status: "fail",
            message: error.message || "Could not generate a description"
        });
    }
};

export { createTripPlan, writeDescription };