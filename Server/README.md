# Installation

Install node using nvm
-----------

First you need to install nvm by running the following command:

        wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

Then you need to export the path to nvm by running the following command:

        export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.  nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

Now you need to reload the terminal by running the following command:

        source ~/.bashrc

And finally you can install node lts version by running the following command:

        nvm install --lts

After installing node you need to install the required dependencies by running the following command:

        npm i

Setup environment variables
-----------

The first thing you need to do before running the application is to create a `.env` file in the root directory of the project and add the following variables:

        # MONGODB
        MONGODB_CNN = '(Your MongoDB connection string)'
        
        # CLOUDINARY
        CLOUDINARY_CLOUD_NAME = '(Your Cloudinary cloud name)'
        CLOUDINARY_API_KEY = '(Your Cloudinary API key)'
        CLOUDINARY_API_SECRET = '(Your Cloudinary API secret)'
        
        # JSON WEB TOKEN
        JWT_SECRET= '(Your JWT secret)'

# Running the application

Now you can use the API by running the following command:

       npm start

You can also run if you want to use the developer mode:

        npm run dev

# Connecting to server

After running locally the application you can connect to the server using the following URL:

        http://localhost:3000/

Or if you are using the production server you can connect to the server using the following URL:

        https://scores-api-production.up.railway.app/

# Helpful information

Used Packages
-----------

You can take a look at the used packages in the following link:

-   [bcrypt](https://www.npmjs.com/package/bcrypt)
-   [cloudinary](https://www.npmjs.com/package/cloudinary)
-   [cookie-parser](https://www.npmjs.com/package/cookie-parser)
-   [cors](https://www.npmjs.com/package/cors)
-   [debug](https://www.npmjs.com/package/debug)
-   [dotenv](https://www.npmjs.com/package/dotenv)
-   [express](https://www.npmjs.com/package/express)
-   [express-fileupload](https://www.npmjs.com/package/express-fileupload)
-   [express-validator](https://www.npmjs.com/package/express-validator)
-   [hbs](https://www.npmjs.com/package/hbs)
-   [http-errors](https://www.npmjs.com/package/http-errors)
-   [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
-   [jwt-decode](https://www.npmjs.com/package/jwt-decode)
-   [mongoose](https://www.npmjs.com/package/mongoose)
-   [morgan](https://www.npmjs.com/package/morgan)
-   [uuid](https://www.npmjs.com/package/uuid)

## Release Notes

v 1.0.0

## Useful Links

[API Documentation](https://documenter.getpostman.com/view/23770643/2s8Z6x3ZZS)

[Deployed on Railway](https://scores-api-production.up.railway.app/)
