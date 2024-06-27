# Setting up Silhouette

Below are the instructions to setup Silhouette locally.

## Prerequisites

Node.js and NPM must be installed on the system.

## Cloning the Repository

```bash
git clone https://github.com/anuragpsarmah/Silhouette.git
cd Silhouette
```

## Configurations

**Environment File**: Navigate to the root folder and create `.env` file. Add the following content to the file:

    MONGODB_URI=
    RESEND_API_KEY=
    NEXTAUTH_SECRET=

    #Firebase Keys
    NEXT_PUBLIC_FIREBASE_APIKEY=
    NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECTID=
    NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID=
    NEXT_PUBLIC_FIREBASE_APPID=
    NEXT_PUBLIC_FIREBASE_MEASUREMENTID=
    
 - Create accounts at MongoDB, Resend and Firebase to setup the keys. `NEXTAUTH_SECRET` can be any secret or randomly generated key.    

## Running the Application

  - Navigate to the root directory.
  - Install dependencies: `npm install`.
  - Start the application: `npm run dev`.

## License

This project is licensed under the Creative Commons Attribution 4.0 International License - see the [LICENSE](LICENSE) file for details.

