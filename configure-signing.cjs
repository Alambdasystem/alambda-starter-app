const fs = require('fs');
const file = 'android/app/build.gradle';
let text = fs.readFileSync(file, 'utf8');
if (!text.includes('signingConfig signingConfigs.debug')) throw new Error('Expected Expo Gradle signing configuration not found');
text = text.replace('signingConfigs {', `signingConfigs {
        release {
            storeFile file(System.getenv("CM_KEYSTORE_PATH"))
            storePassword System.getenv("CM_KEYSTORE_PASSWORD")
            keyAlias System.getenv("CM_KEY_ALIAS")
            keyPassword System.getenv("CM_KEY_PASSWORD")
        }`);
const marker = 'release {';
const start = text.indexOf(marker, text.indexOf('buildTypes {'));
if (start < 0) throw new Error('Release build type not found');
text = text.slice(0,start) + text.slice(start).replace('signingConfig signingConfigs.debug','signingConfig signingConfigs.release');
fs.writeFileSync(file,text);
