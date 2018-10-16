import {ISocialMedia} from "../interfaces/ISocialMedia";
import GitHubLogo from './../assets/images/GitHubLogo.png';
import TwitterLogo from './../assets/images/TwitterLogo.png';
import MediumLogo from './../assets/images/MediumLogo.png';
import {AppSettings} from "../settings/AppSettings";

const SocialMediaData:ISocialMedia[] = [
    {
        displayName: "Medium",
        image: MediumLogo,
        imageAlt: "Medium Logo",
        href: AppSettings.MEDIUM_URL
    },
    {
        displayName: "Twitter",
        image: TwitterLogo,
        imageAlt: "Twitter Logo",
        href: AppSettings.TWITTER_URL
    },
    {
        displayName: "Github",
        image: GitHubLogo,
        imageAlt: "GitHub Logo",
        href: AppSettings.GITHUB_URL
    },
];

export default SocialMediaData;