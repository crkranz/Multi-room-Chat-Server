# Multi-room-Chat-Server



User Join/Leave Notifications: Implemented real-time notifications for when users join or leave a chat room. When a user engages in certain actions like entering a new chat room or disconnecting from an existing one, the server side engages in an action that essentially broadcasts real-time updates regarding that particular user to the remaining members of the room, hence keeping them informed.

Emoji User Icons: When selecting a nickname, users can also choose an avatar from a dropdown of emoji icons, that then gets associated with their username in the database and is represented whenever the user does any actions such as sending messages, joining, leaving etc. The database is essentially adapted to incorporate this visual xxx into their profile.

Emoji Message Buttons: Users have the option to send emojis as standalone messages by clicking dedicated emoji buttons. The server side has been adapted to recognize when a message contains only an emoji, handling its transmission to the chat log as a distinct message type and displaying it as the emoji that was chosen.

Additional Info:

The website displays the main lobby on the left, with the option to create a user with a nickname, including an emoji avatar! There is also an option to create a room (optionaly with a password), and all available rooms are shown to the user with the option of joining them under available rooms.
⁠Enter a nickname at the top to create your user.
⁠Then, you have the ability to create a room, optionally with a password, or join other rooms - if there isnt a password just click ok.
⁠Once in the room, you and other users in the room's names will appear above the chat box.
⁠If you created the room, you can kick out other users or ban them.
You can send people in your room private messages!
⁠Once kicked out or banned, users go back to the lobby. If permanently banned, they will not be able to get back into the room they were banned from.
