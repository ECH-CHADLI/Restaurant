### Admin endpoints

http://localhost:3000/admin/...

### Reservation endpoints

http://localhost:3000/reservation/...

## In backend.js file

// Reservation router
app.use('/reservation', reservationRouter);

// Admin router
app.use('/admin', adminRouter);
