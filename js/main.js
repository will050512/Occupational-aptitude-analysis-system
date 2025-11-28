import { GameEngine } from './engine.js';
import { socialStylesModule } from './modules/socialStyles.js';

document.addEventListener('DOMContentLoaded', () => {
    const engine = new GameEngine('game-container');
    
    // Load the default module
    engine.loadModule(socialStylesModule);
});
