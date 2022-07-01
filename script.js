const buttonShowHideAnswer = document.querySelector('#showHideAnswer');
const buttonFetchRandomQuestion = document.querySelector('#randomQuestion');
const imgSolution = document.querySelector('.image_container');
const answer = document.querySelector('.answer_container');
const question = document.querySelector('.container');
let questions_answers = {};
let questionMemory = [];
let firstQuestionAsked = false;


// all'apertura della pagina web mi carico tutte le domande con le relative risposte
fetch('questions&answers.json')
    .then((response) => {return response.json()})
    .then((json) => {
        // acquisiamo le domande e le relative risposte (e soluzioni)
        questions_answers = json;
        // inizializziamo il contatore delle domande totali
        document.querySelector('#counter').querySelector('span').innerText = questions_answers.length;
        // all'avvio, quelle rimanenti sono pari alle totali
        document.querySelector('#remaining').querySelector('span').innerText = questions_answers.length;
    });

// all'apertura aggiungo il listener al bottone random: al click mostro una domanda
buttonFetchRandomQuestion.addEventListener('click', () => {
    // controlliamo se le domande sono finite
    if (questions_answers.length === questionMemory.length) {
        // domande finite
        question.classList.add('hidden');
        buttonShowHideAnswer.classList.add('hidden');
        document.querySelector('#finish').classList.remove('hidden');
    } else {
        // ci sono ancora domande da mostrare...

        // nascondiamo la sezione relativa alla risposta (se prima l'utente l'ha mostrata)
        answer.classList.add('hidden');
        buttonShowHideAnswer.querySelector('p').innerText = 'MOSTRA RISPOSTA';
        buttonShowHideAnswer.classList.add('show');
        buttonShowHideAnswer.classList.remove('hide');

        // mostriamo il contenitore della domanda
        question.classList.remove('hidden');
        buttonShowHideAnswer.classList.remove('hidden');

        let randomIndex;

        if (firstQuestionAsked === false) {
            randomIndex = Math.round(Math.random() * (questions_answers.length - 1));
            firstQuestionAsked = true;
        } else {
            let found;
            do {
                randomIndex = Math.round(Math.random() * (questions_answers.length - 1));

                found = false;
                for (let number of questionMemory)
                    if (randomIndex === number) {
                        found = true;
                        break
                    }
            } while (found === true)
        }

        questionMemory.push(randomIndex);

        // aggiorniamo il contatore delle domande rimanenti:
        document.querySelector('#remaining').querySelector('span').innerText = (questions_answers.length - questionMemory.length).toString();

        let randomQuestion = questions_answers[randomIndex];
        console.clear();
        console.log(randomQuestion);

        question.querySelector('h4.question').innerText = randomQuestion.question;
        question.querySelector('h4.answer').innerText = randomQuestion.answer;

        document.querySelector('ul').innerHTML = "";
        // per ogni opzione creiamo un <li>
        for (let option of randomQuestion.options) {
            const li = document.createElement('li');
            li.innerText = option;
            document.querySelector('ul').appendChild(li);
        }

        if (randomQuestion.hasOwnProperty('solution')) {
            imgSolution.querySelector('img').src = randomQuestion.solution;
            imgSolution.classList.remove('hidden');
        } else {
            imgSolution.querySelector('img').src = "";
            imgSolution.classList.add('hidden');
        }
        if (randomQuestion.hasOwnProperty('high probability')) {
            document.querySelector('.container').classList.add('important_container');
            document.querySelector('.important').classList.remove('hidden');
        } else {
            document.querySelector('.container').classList.remove('important_container');
            document.querySelector('.important').classList.add('hidden');
        }
    }
});

// se clicco sul pulsante sotto la domanda
buttonShowHideAnswer.addEventListener('click', () => {
    // se la risposta è nascosta la mostro
    if (answer.classList.contains('hidden')) {
        answer.classList.remove('hidden');
        buttonShowHideAnswer.querySelector('p').innerText = 'NASCONDI RISPOSTA';
        buttonShowHideAnswer.classList.add('hide');
        buttonShowHideAnswer.classList.remove('show');
    } else {
        // altrimenti la nascondo
        answer.classList.add('hidden');
        buttonShowHideAnswer.querySelector('p').innerText = 'MOSTRA RISPOSTA';
        buttonShowHideAnswer.classList.add('show');
        buttonShowHideAnswer.classList.remove('hide');
    }
});