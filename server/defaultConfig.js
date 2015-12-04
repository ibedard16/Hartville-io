module.exports = {
    
    JWT_SECRET: 'This is the secret that is used to make all of the JWTs. \
        You don\'t have to change it, these sentences will work fine. \
        However, it is advised that you change it. \
        This secret is public on Github and there would be a ton of security vulnerabilities if left unchanged',
        
    FACEBOOK_SECRET: '[Insert Facebook secret here]',
    
    GOOGLE_SECRET: '[Insert Google secret here]',
    
    GITHUB_SECRET: '[Insert Github secret here]',
    
    EMAIL_SECRET: 'This is like the JWT secret. Again, you can leave it unchanged if you want, but be aware of security vulnerabilities.',
    
    //This customizes the script used to send emails.
    EMAIL_SENDER: {
        service: 'gmail',
        auth: {
            email: 'ibedard@biomedscienceacademy.org',
            pass: 'thisisn\'tmyrealpassword'
        }
    },
    
    //The APP_URL is the url the app can be accessed at. 
    //If you change nothing else in your config, at least change this. It's required for the server to wrok.
    APP_URL: 'http://hartville-io-ibedard16.c9.io/',
    
    //This is supposed to be the URL of your own Mongo server. By default, it's a read-only link of our database. 
    //If you want to have custom content, it's strongly reccommended that you change this URL.
    DATABASE_URL: 'mongodb://PostReader:PostReader@ds059672.mongolab.com:59672/hartvilleio',
    
    //This customizes what the client sees and how some scripts on the client work.
    client_config: {
        app_name: 'Words of Code',
        app_description: 'Speaking Words of Code Since 2015',
        colors: {
            //Brand Colors
            $colorBrand:        '#24719f',
            $colorBrandLight:   '#0d547e',
            $colorBrandDark:    '#0c496d',
            
            //Accent Colors
            $colorAccent:       '#5ec25a',
            $colorAccentLight:  '#76e071',
            $colorAccentDark:   '#42883F',
        },
        OAuth_providers: {
            google: {
                clientId: '[Insert Google client ID here.]',
                url: 'google',
                authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
                requiredUrlParams: ['scope'],
                optionalUrlParams: ['display'],
                scope: ['profile', 'email'],
                scopePrefix: 'openid',
                scopeDelimiter: ' ',
            },
            facebook: {
                authorizationEndpoint: 'https://www.facebook.com/v2.4/dialog/oauth',
                clientId: '[Insert Facebook client ID here.]',
                url: 'facebook',
                scope: ['email', 'public_profile']
            },
            github: {
                clientId: '[Insert Github client ID here.]',
                url: 'github',
                authorizationEndpoint: 'https://github.com/login/oauth/authorize',
                optionalUrlParams: ['scope'],
                scope: ['user:email'],
                scopeDelimiter: ' ',
                responseType: 'code',
                popupOptions: { width: 1020, height: 618 }
            }
        },
        eventBrite: {
            userId: 105404982939,
            anon_token: '47V5C76BOA4YQ2GQ52QI',
            tracking_code: 'hartvilleio'
        }
    },
    
    disAllowSignup: false,
    actuallySendEmail: false
};