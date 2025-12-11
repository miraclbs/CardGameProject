import { SPACE_CONFIG } from './space/spaceConfig';

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
        id: 'wizard',
        name: 'Buyucu Maceralari',
        description: 'Sihirli dunyada buyulu maceralar yasayacaksin',
        locked: true,
        img: '/img/moon-card.png',
        lockedImg: '/img/moon-card-lock.png'
    }
};

export const getLevelConfig = (levelId) => {
    return LEVELS[levelId] || LEVELS.space;
};

export const getAllLevels = () => {
    return Object.values(LEVELS);
};
