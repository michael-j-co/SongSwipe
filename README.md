# PlaylistBuddy

PlaylistBuddy is a web application that allows users to create and edit Spotify playlists with ease. It leverages the Spotify API to suggest songs and playlists based on user-defined tags and preferences, providing a streamlined and user-friendly experience for music lovers.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **User Authentication**: Log in with your Spotify account to access your playlists.
- **Create Playlists**: Enter playlist details such as title, tags, and description.
- **Select Playlists and Tracks**: Search and select playlists and tracks to add to your new playlist.
- **Undo/Redo**: Easily undo or redo your last action to refine your selections.
- **Edit Existing Playlists**: Modify your existing Spotify playlists with a few clicks.
- **Dark Mode**: Clean and modern dark-themed user interface.

## Demo

A live demo of the app is available [here](#). (Replace with your actual link if hosted)

## Installation

To run PlaylistBuddy locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/PlaylistBuddy.git
   cd PlaylistBuddy

2. **Install the dependencies**:
    ```bash
    npm install

3. **Set up environment variables:**
    Create a .env file in the root directory and add your Spotify API credentials:

    ```bash
    REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
    REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
    REACT_APP_SPOTIFY_SCOPE=user-read-private user-read-email playlist-modify-public playlist-modify-private

4. **Start the development server:**
    ```bash
    npm start

## Usage

Log In: Click the "Log in with Spotify" button and authenticate with your Spotify account.
Create a New Playlist:
Enter playlist details: title, description, tags, and privacy settings.
Select existing playlists to use for track suggestions.
Choose tracks to add to your new playlist.
Edit an Existing Playlist:
Navigate to the "Edit Playlist" section.
Select a playlist and modify its tracks and details.

## Contributing
Contributions are welcome! If you'd like to improve this project, please follow these steps:
    Fork the repository.
    Create a new branch: git checkout -b feature-branch-name.
    Make your changes and commit them: git commit -m 'Add some feature'.
    Push to the branch: git push origin feature-branch-name.
    Create a pull request.
Please make sure your code is well-tested.

## Contact
If you have any questions or feedback, feel free to reach out:

Name: Michael Co
Email: michaelco@ucla.edu
GitHub: michael-j-co