import { Configuration } from "../settings/configuration.settings";

export const getImageUrl = (relativeImageUrl) => {
    return `${Configuration.backendUrl}${relativeImageUrl}`;
}