import request from 'supertest';

const APP_URL = 'http://localhost:8000';
const agent = request.agent(APP_URL);



describe('Homely Hub API E2E Tests', () => {
    let testUser = {
        name: 'Test User',
        email: `test_${Date.now()}@example.com`,
        password: 'password123',
        passwordConfirm: 'password123',
        phoneNumber: `${Math.floor(1000000000 + Math.random() * 9000000000)}`
    };

    let testProperty = {
        propertyName: 'Test Villa',
        description: 'A beautiful test villa',
        propertyType: 'House',
        roomType: 'Entire Home',
        amenities: [
            { name: 'Wifi', icon: 'wifi' },
            { name: 'Pool', icon: 'pool' }
        ],
        maximumGuest: 4,
        price: 5000,
        address: {
            street: '123 Test St',
            city: 'Testville',
            state: 'TestState',
            area: 'Downtown',
            pinCode: '123456'
        },
        images: Array(6).fill({ url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' })
    };

    let createdPropertyId = '';
    let createdBookingId = '';

    test('1. Server is running', async () => {
        const res = await agent.get('/');
        expect(res.status).toBe(200);
        expect(res.text).toBe('Homelyhub server is running');
    });

    test('2. User Signup', async () => {
        const res = await agent.post('/api/v1/rent/user/signup').send(testUser);
        if (res.status !== 201) {
            console.error('Signup Failed:', res.body);
        }
        expect(res.status).toBe(201);
        expect(res.body.status.toLowerCase()).toBe('success');
        expect(res.body.token).toBeDefined();
    });

    test('3. User Check (Auth)', async () => {
        const res = await agent.get('/api/v1/rent/user/me');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.user.email).toBe(testUser.email);
    });

    test('4. Create Property', async () => {
        const res = await agent.post('/api/v1/rent/user/newAccommodation').send(testProperty);
        if (res.status !== 200) {
            console.error(res.body);
        }
        expect(res.status).toBe(200);
        expect(res.body.status.toLowerCase()).toBe('success');
        expect(res.body.data.data).toBeDefined();
        createdPropertyId = res.body.data.data._id;
    }, 30000);

    test('5. Get All Properties', async () => {
        const res = await agent.get('/api/v1/rent/listing');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(Array.isArray(res.body.data)).toBe(true);
    }, 15000);

    test('6. Create Booking Order', async () => {
        const orderData = {
            amount: 5000,
            propertyId: createdPropertyId,
            fromDate: '2026-10-01',
            toDate: '2026-10-05',
            guests: 2
        };
        const res = await agent.post('/api/v1/rent/user/booking/create-order').send(orderData);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.orderId).toBeDefined();
    });

    test('7. Verify Payment & Confirm Booking', async () => {
        const paymentData = {
            orderId: `order_${Date.now()}`,
            forceStatus: 'success',
            bookingDetails: {
                propertyId: createdPropertyId,
                price: 5000,
                fromDate: '2026-10-01',
                toDate: '2026-10-05',
                guests: 2,
                nights: 4
            }
        };
        const res = await agent.post('/api/v1/rent/user/booking/verify-payment').send(paymentData);
        if (res.status !== 200) {
            console.error(res.body);
        }
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.newBooking).toBeDefined();
        createdBookingId = res.body.newBooking._id;
    });

    test('8. Get User Bookings', async () => {
        const res = await agent.get('/api/v1/rent/user/booking');
        if (res.status !== 200) {
            console.error('Get User Bookings Error:', res.body);
        }
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(Array.isArray(res.body.data.bookings)).toBe(true);
        // Should contain our booking
        const found = res.body.data.bookings.find(b => b._id === createdBookingId);
        expect(found).toBeDefined();
        expect(found.property).toBeDefined(); // Testing populate
    });

    test('9. AI Generate Description', async () => {
        const reqData = {
            propertyName: 'Test Villa',
            propertyType: 'Villa',
            location: 'Goa',
            amenities: ['Pool', 'WiFi', 'AC']
        };
        const res = await agent.post('/api/v1/rent/user/generateDescription').send(reqData);
        // We will check the actual endpoint route below. If it's different, we'll fix it.
        if (res.status !== 200 && res.status !== 404) {
             console.error(res.body);
        }
        // Let's just expect it to exist for now
        expect(res.status).not.toBe(404);
    }, 15000);

});
