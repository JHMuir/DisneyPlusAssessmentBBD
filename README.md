# Disney+ Assessment for BBD Team

Hello! Welcome to my submission for the Disney+ BBD Take-Home.

To run this project, first clone the repository using: 

```bash
git clone
```

Once the repo is cloned, enter the directory and install the dependencies using:

```bash
npm install
```

After you've installed the dependencies, run a locally hosted page with: 

```
npm run dev
```

The stack used is TypeScript/HTML/CSS with React. No other 3rd party library or software was used.

This project consumes the provided API and renders rows of "cards" based on the items from the API, one row at a time. 

**Left/Right** or **A/D**: Navigates the current card row. \
**Up/Down** or **W/S**: Changes which row is being rendered. \
**Enter**: Interacts with the currently hovered card, displaying and overlay with extra information about that item. If the item has a video link associated with its data, the overlay plays the video.
