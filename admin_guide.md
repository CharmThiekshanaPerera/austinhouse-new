# Austin House - Admin Panel Guide

This guide covers how to access the admin panel, the default credentials, how to navigate the interface, and how to test its integrations with the frontend website.

## 1. How to Login

To access the admin panel:

1. Ensure both the backend (`uvicorn app.main:app --reload`) and frontend (`npm run dev`) servers are running.
2. Open your browser and navigate to the frontend admin route: **`http://localhost:8080/admin`** (replace `8080` with your port if your frontend runs on a different one, like `5173`).
3. You will be prompted with a login screen.

## 2. Admin User Data (Credentials)

We have seeded a default administrator account into the MongoDB Atlas database. Use the following to log in:

- **Username:** `admin`
- **Password:** `admin123`

*Note: If the login fails with an "Incorrect username or password" or network error, please verify that your backend is running and that it has successfully connected to your MongoDB Atlas database.*

## 3. How to Handle the Admin Panel

Once logged in, you will be taken to the Dashboard. Use the sidebar on the left to navigate between different data management modules:

- **Dashboard:** Shows a high-level summary of your business, recent bookings, and latest customers.
- **Bookings:** Here you can track, approve, or cancel appointments made by customers on the public site.
- **Customers (CRM):** Allows you to view a list of people who have interacted with your business. You can see their details, booking history, and manage their statuses.
- **Staff Scheduling:** Manage your team! You can:
  - Add new staff members and their roles.
  - Upload profile pictures (either by providing a URL or directly uploading a file from your computer).
  - Use the **"Visible on Frontend" toggle** to decide if a staff member should be displayed on the public "Meet The Team" page.
- **Services:** Add or modify spa services. Just like staff, you can upload images to showcase the service.
- **Blog:** Manage your blog posts. **Important:** By default, new posts are created as **Published**. You can edit them to set them as drafts if you want to hide them from the frontend.
- **Gallery:** Upload Before & After transformation pictures and facility photos to be displayed in the public gallery.
- **Messages:** Any customer who fills out the "Send Us a Message" contact form on the frontend will have their message show up here. You can mark them as read or deleted.

## 4. How to Test the Admin Panel

To ensure everything is hooked up correctly, here are a few tests you can run:

### Test A: File Uploads & Visibility

1. Go to the **Staff** module in the Admin Panel.
2. Add a new staff member and use the "Upload File" button to upload a test image from your PC.
3. Make sure the visibility switch is toggled ON.
4. Save the staff member.
5. In a new tab, open the public homepage (`http://localhost:8080`) and scroll down to the "Meet The Team" section. Verify the new member and their image appear.
6. Go back to the Admin Panel, edit that staff member, and toggle the visibility OFF. Refresh the frontend, and they should immediately disappear.

### Test B: Public Form Submissions

1. Open the public homepage.
2. Find the "Find Us / Send Us a Message" section at the bottom.
3. Fill out the contact form with fake test data and submit it.
4. Go to the Admin Panel and click on the **Messages** tab. Your newly submitted test message should instantly appear there.

### Test C: Booking Flow

1. Go to the public homepage and click a "Book Now" button.
2. Select a service, date, time, and enter your details to finalize a booking.
3. Go to the Admin Panel -> **Bookings** tab and verify the new appointment now sits in your dashboard as *Pending*.

---
*Tip: To log out of the admin panel, expand the sidebar and click the **Logout** button at the very bottom.*
