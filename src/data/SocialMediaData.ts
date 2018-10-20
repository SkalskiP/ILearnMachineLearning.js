import {ISocialMedia} from "../interfaces/ISocialMedia";
import {AppSettings} from "../settings/AppSettings";

const SocialMediaData:ISocialMedia[] = [
    {
        displayName: "Medium",
        imageSrc: "/images/ico/MediumLogo.png",
        imageAlt: "Medium Logo",
        href: AppSettings.MEDIUM_URL
    },
    {
        displayName: "Twitter",
        imageSrc: "/images/ico/TwitterLogo.png",
        imageAlt: "Twitter Logo",
        href: AppSettings.TWITTER_URL
    },
    {
        displayName: "Github",
        imageSrc: "/images/ico/GitHubLogo.png",
        imageAlt: "GitHub Logo",
        href: AppSettings.GITHUB_URL
    },
];

export default SocialMediaData;