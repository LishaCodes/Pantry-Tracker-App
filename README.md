# Pantry Tracker

This project is a web-based pantry management system built using React (Next.js) and Firebase. The application allows users to track pantry items, add, edit, and delete items, and view a searchable list of items with relevant information such as quantity and expiry date.

## Features

1. **Authentication**: 
   - Users must log in to access their personalized pantry list. The login functionality is powered by Firebase Authentication.

2. **Add/Edit/Delete Pantry Items**:
   - Users can add pantry items, specifying the item name, quantity, and expiry date.
   - Items can also be edited or deleted as needed.

3. **Search Functionality**:
   - A search bar allows users to filter their pantry items by name, making it easier to find specific items.

4. **Real-Time Sync**:
   - The application uses Firebase Firestore to store pantry items, ensuring real-time updates across devices.

5. **Responsive Design**:
   - The UI is responsive and user-friendly, making it accessible across various devices.

6. **Snackbar Notifications**:
   - Feedback is provided to the user through snackbars (toast notifications), confirming actions such as adding, editing, and deleting items.

## Tech Stack

- **Frontend**: React (Next.js)
- **Backend**: Firebase Firestore (NoSQL database), Firebase Authentication
- **UI Components**: Material-UI for a clean and responsive user interface.
