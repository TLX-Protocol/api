# Scope

## Database

The database will be built using Firebase Firestore Database.

We will have two tables, one to store information about users, and one to store information about invite codes.

### User:

- `address` **primary key** Users's wallet address
- `twitter_access_token` The access token of the user's Twitter account
- `twitter_secret` The secret of the user's Twitter account
- `discord_access_token` The access token of the user's Discord account
- `discord_secret` The secret of the user's Discord account

### Codes:

- `invite_code` **primary key** The invite code
- `creator` Who created the invite code
- `user` **optional** The user who claimed in invite code

## API

The API will be a JavaScript Firebase Function with HTTP trigger.

### Register

The register endpoint is a POST endpoint.
It takes as an input the full user data including address, twitter info and discord info. And the invite code.
The endpoint first validates that the Twitter info is valid.
It then validates that the user is following us on Twitter.
It then validates that the Discord info is valid.
It then validates that the user is in our Discord.
It then validates that the signature is valid for the address.
It then validates that the address hasn't already been used in our database.
It then validates that the Twitter hasn't already been used in our database.
It then validates that the Discord hasn't already been used in our database.
It then validates that the invite code is valid, and not used.
It then updates that invite code as claimed and with the users address.
It then generates 5 invite codes for the user, and writes them to the database.
It then writes the user data to the database.
It then returns the invite codes in the response.
If any of the validations fail, it returns an appropriate error message to display on the UI.

### Has Registered

The Has Registered endpoint is a GET endpoint.
It takes an addres as an input.
It returns `true` or `false` based on if the user has already registered.

### Invite Codes

The Invite Codes endpoint is a GET endpoint.
It takes an addres as an input, and a signature to prove that the caller owns the address.
It returns a list of Invite codes for the user.

### Is Invite Code Used

The Is Invite Code Used endpoint is a GET endpoint.
It takes an invite code as an input.
It returns `true` or `false` based on if the invite code has been used yet.
If the invite code doesn't exist, it returns `false` (this is to prevent brute forcing to find invite codes).

## Front end

### Register button

The top right Twitter button will be replaced with a Rebalance button.

### Connect wallet popup

A popup will be added for the users to connect their wallet when they click on the Register button

### Check if user is registered

A check will be done once the user's wallet is connected to see if they have registered yet.

### Register popup

If the user has not registered yet, a Register popup will show.
The popup will have the header "Register".
The popup will have 5 steps.
There will be an input field for inputting your invite code.
There will be a section for authenticating with Twitter. This will call to the Twitter API to register the user and get their access token and secret.
There will be a section for following us on Twitter which will open our Twitter in a new tab.
There will be a section for authenticating with Discord. This will call to the Discord API to register the user and get their access token and secret.
There will be a section for joining our Discord which will open our Discord in a new tab.
There will be a "Register" button at the bottom. This will be disabled until all the steps above are complete.
As the user complete each step above, a visual indicator will update to show this is done.
When the user clicks the register button, it will make a call to our register API to attemp to register them.
If there is an error, it will show in an error popup.
If it works, then the user will be redirected to the Invite Code view.

### Sign for invite codes

If the users wallet is registered then they click on the "Register" button, it will show a popup.
The popup will have the header "Sign transaction to view invite codes".
It will have a button "View Invite Codes".
When the click that button it will make them sign a transaction, and then make a request to our api to get their invite codes.
It will then redirect to the invite codes popup.

### Invite Codes

This view will show a list of the user's invite codes.
For each invite code it will call our API endpoint to check if that Invite code has been used.
If it has been used, there will be a visual indicator for this.
Next to each invite code will be a copy button allowing users to copy the invite code.
