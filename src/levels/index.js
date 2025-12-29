import { SPACE_CONFIG } from './space/spaceConfig';
import { WIZARD_CONFIG } from './wizard/wizardConfig';

export const LEVELS = {
    space: SPACE_CONFIG,
    detective: {
        id: 'detective',
        name: 'Gizli Cinayet',
        description: 'Gizemli olaylara karsi bir dedektif olarak sorusturma yurut',
        locked: true,
        img: '/img/detective-card.png',
        lockedImg: '/img/detective-card-lock.png'
    },
    wizard: {
        ...WIZARD_CONFIG,
        locked: false
    }
};

export const getLevelConfig = (levelId) => {
    return LEVELS[levelId] || LEVELS.space;
};

export const getAllLevels = () => {
    return Object.values(LEVELS);
};
