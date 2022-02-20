/**
 *  These are options related to the rendering quality that the theatre should
 *  assume.
 */
export default interface RenderingQualitySettings {
    
    // turn on/off antialiasing
    antialiasing:boolean;

    // the shadder precision setting. This defines how precise the shaders should
    // be in their calculations. The low and medium seem to be a required part of
    // the spec and high seems to be optional. This means that we should go with
    // medium as default.
    shaderPrecision:ShaderPrecisionSetting;

    // tells the user agent at which power setting the gpu should run.
    powerPreference:PowerPreferenceSetting;      
};

export enum ShaderPrecisionSetting {
    low     = 'lowp',
    medium  = 'mediump',
    high    = 'highp'
};

export enum PowerPreferenceSetting {
    default = "default",
    high    = "high-performance",
    low     = "low-power"
};