export interface OverallFloodHazardType {
    totalCount: number;
    totalArea: number;
    totalLength: number;
    types: Types;
}

export interface Types {
    building: Building[];
    highway: Highway[];
    landuse: Landuse[];
}

export interface Building {
    farmAuxiliary?: FarmAuxiliary;
    hut?: Hut;
    residential?: Residential;
    cowshed?: Cowshed;
    terrace?: Terrace;
    barn?: Barn;
    detached?: Detached;
    water?: Water;
    temple?: Temple;
    industrial?: Industrial;
    house?: House;
    school?: School;
    yes?: Yes;
    'khar ko channo'?: KharKoChanno;
}

export interface FarmAuxiliary {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Hut {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Residential {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Cowshed {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Terrace {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Barn {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Detached {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Water {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Temple {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Industrial {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface House {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface School {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Yes {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface KharKoChanno {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Highway {
    busStop?: BusStop;
    stop?: Stop;
    livingStreet?: LivingStreet;
    tollGantry?: TollGantry;
    trunkLink?: TrunkLink;
    residential?: Residential2;
    footway?: Footway;
    miniRoundabout?: MiniRoundabout;
    track?: Track;
    unclassified?: Unclassified;
    road?: Road;
    cycleway?: Cycleway;
    secondary?: Secondary;
    trunk?: Trunk;
    tertiary?: Tertiary;
    service?: Service;
    primary?: Primary;
    path?: Path;
    crossing?: Crossing;
    turningCircle?: TurningCircle;
}

export interface BusStop {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Stop {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface LivingStreet {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface TollGantry {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface TrunkLink {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Residential2 {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Footway {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface MiniRoundabout {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Track {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Unclassified {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Road {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Cycleway {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Secondary {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Trunk {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Tertiary {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Service {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Primary {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Path {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Crossing {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface TurningCircle {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Landuse {
    religious?: Religious;
    bamboo?: Bamboo;
    grass?: Grass;
    forest?: Forest;
    aquaculture?: Aquaculture;
    meadow?: Meadow;
    farmland?: Farmland;
    residential?: Residential3;
    recreationGround?: RecreationGround;
    military?: Military;
    villageGreen?: VillageGreen;
    industrial?: Industrial2;
    reservoir?: Reservoir;
    orchard?: Orchard;
    greenfield?: Greenfield;
    farm?: Farm;
    scrub?: Scrub;
    basin?: Basin;
    quarry?: Quarry;
    plantNursery?: PlantNursery;
    farmyard?: Farmyard;
    brownfield?: Brownfield;
}

export interface Religious {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Bamboo {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Grass {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Forest {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Aquaculture {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Meadow {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Farmland {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Residential3 {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface RecreationGround {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Military {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface VillageGreen {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Industrial2 {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Reservoir {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Orchard {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Greenfield {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Farm {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Scrub {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Basin {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Quarry {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface PlantNursery {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Farmyard {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}

export interface Brownfield {
    totalCount: number;
    totalArea: number;
    totalLength: number;
}
