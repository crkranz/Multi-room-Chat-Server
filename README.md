# Multi-Room Chat Application - Creative Portion

### User Join/Leave Notifications
- This feature ensures that users are always informed of who enters or leaves a chat room in real time. When a user joins a new chat room or disconnects from an existing one, the server broadcasts notifications to the remaining members of the room. These notifications appear instantly, keeping everyone in the loop about changes in the room's user activity.

### Emoji User Icons
- To enhance personalization, users can select an avatar from a variety of emoji icons when creating their profile. This avatar is then associated with their username in the database and is displayed throughout their interactions. Whether sending messages, joining, or leaving a room, the selected emoji icon represents the user visually, making interactions more engaging and fun.

### Emoji Message Buttons
- The application allows users to send emoji messages as standalone messages by clicking dedicated emoji buttons. The backend is designed to recognize when a message consists solely of an emoji and treat it as a distinct message type. The chosen emoji is then transmitted and displayed as a message within the chat, providing a lighthearted way for users to communicate.

## Additional Features:
### Main Lobby & User Creation
- The main lobby is displayed on the left, where users can enter a nickname to create their profile.
- Users can also select an emoji avatar from a dropdown menu, adding a personalized touch to their profile.

### Room Creation & Joining
- Users can create new chat rooms with a unique name, and optionally, set a password for private access.
- All available rooms are displayed for users to join, and if a room has a password, they can easily enter the password to gain access.

### Chat Room Interaction
- Once inside a room, users' names and emoji icons are displayed above the chat box, creating a dynamic and interactive environment.
- If a user is the creator of the room, they have administrative control and can kick or ban other users from the room.
- Private messaging is also enabled, allowing users to send messages to individuals in the room without others seeing them.

### Ban & Kick Features
- Room creators have the ability to kick users temporarily or ban them permanently from the room.
- Kicked users are sent back to the lobby, while banned users are permanently blocked from entering the specific room they were banned from.

### Multi-Room Chat Server Features
- Administration of User-Created Chat Rooms:
- Users can create rooms with arbitrary names and join rooms as desired.
- The system displays the names of users currently in a room.
- A room can be made private by setting a password.
- Room creators can manage users by temporarily kicking them out or permanently banning them.
### Messaging:
- All users in a room can see messages sent by other users, which include the sender's username.
- Users can send private messages to other users in the same room.

### Best Practices:
- The code is clean, well-formatted, and properly commented.
- The HTML validates correctly to ensure accessibility and compliance with web standards.
- The node_modules folder is ignored by version control to keep the repository clean and efficient.

### Usability:
- The chat application is designed with a focus on ease of use, ensuring that users can easily join rooms and communicate with others.
- The site is visually appealing, with a simple yet intuitive design that enhances user experience.

### Technologies Used:
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Socket.io for real-time communication
- Database: MongoDB (for storing user profiles and room information)
- Security: Password hashing, CSRF protection
