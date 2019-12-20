var app = new Vue({
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
        dataTooltip: '',
        idx: 0,
        answer: '',
        score: 0,
        timeout: 0,
        count_time: 0,
        counter: null,
        ready: false,
        started: false,
        finished: false
    },
    created: function() {
        this.getQuestions();
    },
    computed: {
        loaded: function() {
            console.log('called loaded.')
            return this.ready;
        }
    },
    methods: {
        getQuestions: function() {
            const that = this;
            axios.get('/cgi-bin/api.py', {
                baseURL: 'http://localhost:8000/'
            })
            .then(function(res) {
                console.log(res.data.trim().split(','));
                that.questions = res.data.trim().split(',');
                that.timeout = that.questions.length * 15 * 1000
                that.ready = true;
            })
            .catch(function(e) {
                console.log(e);
            })
        },
        getKey: function(e) {
            console.log('Event(getKey) hook Called.');
            console.dir(e);
            if(this.started) {
                if(e.key=='Enter') {
                    console.log('Enter pressed.');
                    this.compare(e.target.value);
                    if(this.idx < this.questions.length-1) {
                        this.idx += 1;
                    } else {
                        this.finish();
                    }
                    this.answer = '';
                } else {
                    this.answer = e.target.value;
                    console.log(this.answer);
                }
            }
        },
        compare: function() {
            if(this.questions[this.idx] == this.answer) {
                this.score += 1;
            }
        },
        accuracy: function() {
            return this.score / this.questions.length;
        },
        bonas: function() {
            return (this.timeout/1000 - this.count_time) * this.accuracy();
        },
        modalContent: function(msg) {
            msg += ' 正解率('+this.score+'/'+this.questions.length+'): '+this.accuracy()+'， 得点: ' + this.score * this.bonas();
            this.modal.content = msg;
            this.$refs.modal.openModal();
        },
        start: function() {
            console.log('typing start.');
            this.started = true;
            Vue.nextTick(()=>{this.ansFocus()});
            this.counter = setInterval(this.countdown, 1000) || this.counter;
        },
        ansFocus: function() {
            console.log('focus called.');
            this.$refs.answerInput.focus();
        },
        finish: function() {
            console.log('game stopped.');
            clearInterval(this.counter);
            this.modalContent('Finish!');
            this.finished = true;
        },
        countdown: function() {
            console.log('countdown start.');
            if(this.timeout/1000 == this.count_time) {
                this.timeup();
            } else {
                this.count_time += 1;
            }
        },
        timeup: function() {
            console.log('game timeup.');
            clearInterval(this.counter);
            this.modalContent('Time Up!');
            this.finished = true;
        },
        reset: function() {
            console.log('typing reset.');
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
