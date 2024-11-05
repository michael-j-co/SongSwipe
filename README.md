# SongSwipe 🎶

**SongSwipe** is a modern web app that allows users to seamlessly create, edit, and manage their Spotify playlists. With easy swipe-based song selection and playlist editing, SongSwipe integrates with Spotify’s API to make playlist management simple and fun.

**Video Demo** https://drive.google.com/file/d/1lNdeiVghiQJ1OvFZuihbzsemFG49CnfZ/view?usp=drive_link

---

## Features 🚀

- **Swipe through songs** to quickly find and add your favorites.
- **Create and edit playlists** directly from the app.
- **Spotify integration** to sync and manage your music library.
- **Dark/Light mode** support, automatically based on your system or manual preference.
- **Easily share** playlists with friends.
- **Custom playlist suggestions** based on your listening habits.

---

## Prerequisites 🛠

Before running SongSwipe, ensure you have the following installed:

- **Node.js** (v14.x or higher)
- **npm** (Node package manager) or **yarn** (alternative package manager)
- A **Spotify Developer Account** (to obtain your Spotify API credentials)

---

## Installation

To set up SongSwipe on your local machine, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/songswipe.git
cd songswipe
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

### 3. Spotify API setup

To connect to the Spotify API, you need to create an `.env` file in the root directory with your Spotify credentials:

Create a file named `.env` and add the following lines:

```bash
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
REACT_APP_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
REACT_APP_REDIRECT_URI=http://localhost:3000/callback
```

Make sure to replace the values with your actual **Spotify Client ID** and **Client Secret** obtained from your Spotify Developer dashboard.

---

## Running the App 🚀

Once you've installed the dependencies and set up your `.env` file, run the app locally:

```bash
npm start
```

Or, if using yarn:

```bash
yarn start
```

This will start the development server, and you can view the app in your browser at `http://localhost:3000`.

---

## Contributing 🤝

Feel free to fork this repository and submit pull requests. All contributions are welcome!

---
