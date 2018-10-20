import {ISocialMedia} from "../interfaces/ISocialMedia";
import {AppSettings} from "../settings/AppSettings";

const SocialMediaData:ISocialMedia[] = [
    {
        displayName: "Medium",
        image: "/images/ico/MediumLogo.png",
        imageAlt: "Medium Logo",
        href: AppSettings.MEDIUM_URL
    },
    {
        displayName: "Twitter",
        image: "/images/ico/TwitterLogo.png",
        imageAlt: "Twitter Logo",
        href: AppSettings.TWITTER_URL
    },
    {
        displayName: "Github",
        image: "/images/ico/GitHubLogo.png",
        imageAlt: "GitHub Logo",
        href: AppSettings.GITHUB_URL
    },
];

export default SocialMediaData;