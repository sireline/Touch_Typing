const modalTemplate = `
<div>
    <div class="modal" :class="[modalShowStatus ? 'active' : '', modal.size]">
        <a href="" class="modal-overlay" aria-label="Close" @click="closeModal"></a>
        <div class="modal-container">
            <div class="modal-header" v-if="hasHeader">
                <a href="" class="btn btn-clear float-right" aria-label="Close" @click="closeModal"></a>
                <div class="modal-title h5">{{ modal.title }}</div>
            </div>

            <div class="modal-body">
                <div class="content">
                    <slot><h3>{{ modal.content }}</h3></slot> 
                </div>
            </div>

            <div class="modal-footer" v-if="hasFooter">
                <button class="btn" @click="closeModal">Close</button>
            </div>
        </div>
    </div>
</div>
`

const ModalComponent = {
    props: ['modal'],
    template: modalTemplate,
    data: function () {
        return {
            modalShowStatus: false,
            hasHeader: null,
            hasFooter: null,
            cb: null
        }
    },
    created: function () {
        console.log("modal created.");
        console.dir(this.modal);
        this.hasHeader = this.modal.hasHeader || false;
        this.hasFooter = this.modal.hasFooter || false;
        this.cb = this.modal.callBack || false;
    },
    methods: {
        openModal: function () {
            console.log("event called: openModal.");
            this.modalShowStatus = true;
        },
        closeModal: function () {
            console.log("event called: closeModal.");
            this.modalShowStatus = false;
            if(this.cb) {
                this.$emit(this.cb);
            }
        }
    }
}
