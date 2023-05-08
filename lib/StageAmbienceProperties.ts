import { Color } from "three";

export default interface StageAmbienceProperties {
    ambientColor:Color;
    shadowsRange?: number;
    overheadCeiling?: number;
};