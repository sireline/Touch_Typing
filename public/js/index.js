const app = new Vue({
    el: '#app',
    components: {
        'modal': ModalComponent
    },
    data: {
        modal: {
            size: 'modal-lg',
            title: '',
            content: '',
            hasHeader: false,
            hasFooter: true,
            callBack: 'reset'
        },
        questions: [],
        idx: 0,
        answer: '',
        score: 0,
        timeout: 0,
        count_time: 0,
        counter: null,
        ready: false,
        started: false,
        finished: false,
        q_strings: 'abcdefghijklmnopqrstuvwxyz0123456789',
        c_max: 12,
        q_max: 10,
        LOCAL_MODE: true
    },
    created: function() {
        this.getQuestions();
    },
    computed: {
        loaded: function() {
            return this.ready;
        }
    },
    methods: {
        getRandom: function(max) {
            return Math.floor(Math.random() * Math.floor(max));
        },
        getRandomChara: function() {
            return this.q_strings[this.getRandom(this.q_strings.length-1)];
        },
        getQuestions: function() {
            if(this.LOCAL_MODE) {
                for(let i = 0; i < this.q_max; i++) {
                    let s = '';
                    const c_loop = this.getRandom(this.c_max)+1;
                    for(let j = 0; j < c_loop; j++) {
                        s += this.getRandomChara();
                    }
                    this.questions[i] = s;
                }
                this.timeout = this.questions.length * 15 * 1000;
                this.ready = true;
            } else {
                const that = this;
                axios.get('/cgi-bin/api.py', {
                    baseURL: 'http://localhost:8000/'
                })
                .then(function(res) {
                    that.questions = res.data.trim().split(',');
                    that.timeout = that.questions.length * 15 * 1000;
                    that.ready = true;
                })
                .catch(function(e) {
                    console.log(e);
                })
            }
        },
        getKey: function(e) {
            if(this.started) {
                if(e.key == 'Enter') {
                    this.compare(e.target.value);
                    if(this.idx < this.questions.length-1) {
                        this.idx += 1;
                    } else {
                        this.finish();
                    }
                    this.answer = '';
                } else {
                    this.answer = e.target.value;
                }
            }
        },
        compare: function() {
            if(this.questions[this.idx] == this.answer) {
                this.score += 1;
            }
        },
        accuracy: function() {
            return this.score / this.questions.length * 100;
        },
        bonas: function() {
            return (this.timeout/1000 - this.count_time) * this.accuracy();
        },
        point: function() {
            return this.score * 500 + this.bonas();
        },
        modalContent: function(msg) {
            msg += ' 正解率: ' + this.accuracy() + '% ，\n得点: ' + this.point() + '点';
            this.modal.content = msg;
            this.$refs.modal.openModal();
        },
        start: function() {
            this.started = true;
            Vue.nextTick(()=>{this.ansFocus()});
            this.counter = setInterval(this.countdown, 1000) || this.counter;
        },
        ansFocus: function() {
            this.$refs.answerInput.focus();
        },
        finish: function() {
            clearInterval(this.counter);
            this.modalContent('Finish!');
            this.finished = true;
        },
        countdown: function() {
            if(this.timeout/1000 == this.count_time) {
                this.timeup();
            } else {
                this.count_time += 1;
            }
        },
        timeup: function() {
            clearInterval(this.counter);
            this.modalContent('Time Up!');
            this.finished = true;
        },
        reset: function() {
            clearInterval(this.counter);
            this.questions = [];
            this.idx = 0;
            this.score = 0;
            this.count_time = 0;
            this.answer = '';
            this.ready = false;
            this.started = false;
            this.finished = false;
            this.getQuestions();
        }
    }
})
