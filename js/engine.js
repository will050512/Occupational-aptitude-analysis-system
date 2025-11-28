export class GameEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentModule = null;
        this.state = {
            step: 'menu', // menu, story, quiz, result
            currentQuestionIndex: 0,
            answers: [],
            score: {}
        };
    }

    loadModule(module) {
        this.currentModule = module;
        this.resetState();
        this.renderMenu();
    }

    resetState() {
        this.state = {
            step: 'menu',
            currentQuestionIndex: 0,
            answers: [],
            score: {}
        };
        this.updateProgressBar(0);
    }

    renderMenu() {
        this.container.innerHTML = `
            <div class="menu-screen">
                <h2>${this.currentModule.title}</h2>
                <p>${this.currentModule.description}</p>
                <button id="start-btn" class="btn">開始測驗</button>
            </div>
        `;
        document.getElementById('start-btn').addEventListener('click', () => {
            if (this.currentModule.story) {
                this.startStory();
            } else {
                this.startQuiz();
            }
        });
        this.hideProgressBar();
    }

    startStory() {
        this.state.step = 'story';
        const story = this.currentModule.story;
        this.container.innerHTML = `
            <div class="story-screen">
                <h3>${story.title}</h3>
                <div class="story-content">
                    ${story.content.map(p => `<p>${p}</p>`).join('')}
                </div>
                <button id="continue-btn" class="btn">繼續</button>
            </div>
        `;
        document.getElementById('continue-btn').addEventListener('click', () => {
            this.startQuiz();
        });
    }

    startQuiz() {
        this.state.step = 'quiz';
        this.state.currentQuestionIndex = 0;
        this.showProgressBar();
        this.renderQuestion();
    }

    renderQuestion() {
        const question = this.currentModule.questions[this.state.currentQuestionIndex];
        const totalQuestions = this.currentModule.questions.length;
        
        this.updateProgressBar(((this.state.currentQuestionIndex) / totalQuestions) * 100);

        this.container.innerHTML = `
            <div class="question-card">
                <div class="question-header">
                    <span>問題 ${this.state.currentQuestionIndex + 1} / ${totalQuestions}</span>
                </div>
                <div class="question-text">${question.text}</div>
                <div class="options-grid">
                    ${question.options.map((opt, index) => `
                        <button class="option-btn" data-index="${index}">
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        const buttons = this.container.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedIndex = parseInt(e.currentTarget.dataset.index);
                this.handleAnswer(selectedIndex);
            });
        });
    }

    handleAnswer(selectedIndex) {
        const question = this.currentModule.questions[this.state.currentQuestionIndex];
        const selectedOption = question.options[selectedIndex];
        
        // Record answer
        this.state.answers.push({
            questionId: this.state.currentQuestionIndex,
            value: selectedOption.value // e.g., 'D', 'I', 'S', 'C'
        });

        // Next question or finish
        this.state.currentQuestionIndex++;
        if (this.state.currentQuestionIndex < this.currentModule.questions.length) {
            this.renderQuestion();
        } else {
            this.finishQuiz();
        }
    }

    finishQuiz() {
        this.updateProgressBar(100);
        this.calculateScore();
        this.renderResult();
    }

    calculateScore() {
        // Initialize scores based on module types
        const types = this.currentModule.types || ['D', 'I', 'S', 'C'];
        types.forEach(t => this.state.score[t] = 0);

        this.state.answers.forEach(ans => {
            if (this.state.score[ans.value] !== undefined) {
                this.state.score[ans.value]++;
            }
        });
    }

    renderResult() {
        const resultData = this.currentModule.calculateResult(this.state.score);
        
        this.container.innerHTML = `
            <div class="result-container">
                <h2>測驗結果</h2>
                <div class="result-summary">
                    <h3>你是：${resultData.title}</h3>
                    <p>${resultData.description}</p>
                </div>
                
                <div class="result-details">
                    ${resultData.details.map(detail => `
                        <div class="result-card">
                            <h4>${detail.label}</h4>
                            <p>${detail.text}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="story-content" style="margin-top: 30px; border-top: 1px solid #ccc; padding-top: 20px;">
                     <h3>給您的建議</h3>
                     <p>${this.currentModule.closingStory || ''}</p>
                </div>

                <button id="restart-btn" class="btn btn-secondary">重新測驗</button>
            </div>
        `;

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.resetState();
            this.renderMenu();
        });
    }

    showProgressBar() {
        document.getElementById('progress-container').classList.remove('hidden');
    }

    hideProgressBar() {
        document.getElementById('progress-container').classList.add('hidden');
    }

    updateProgressBar(percent) {
        document.getElementById('progress-bar').style.width = `${percent}%`;
    }
}
