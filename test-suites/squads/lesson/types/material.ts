export type SingleMaterialFile = 'pdf' | 'video' | 'brightcove video';
export type MultipleMaterialFile = 'pdf 1' | 'pdf 2' | 'video 1' | 'video 2';
export type MaterialFile = SingleMaterialFile | MultipleMaterialFile;
export type MaterialFileState = 'can see' | 'does not see';
