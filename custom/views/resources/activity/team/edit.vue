<template>
    <div class="app-container">
        <el-form :rules="rules" ref="form" :model="form" label-position="left"
                 label-width="110px">
            <div class="sticky-box">
                <sticky :z-index="10" :class-name="'sticky-item'">
                    <el-button size="medium" type="primary" :loading="buttonLoading" :disabled="buttonDisabled"
                               @click="handleUpdate">更新
                    </el-button>
                    <el-button size="medium" type="default" @click="backToList">返回</el-button>
                </sticky>
            </div>
            <div class="detail-form-box">
                <el-form-item :label="'活动ID'">
                    {{form.id}} (系统级,不可更改)
                </el-form-item>

                <el-form-item :label="'活动标题'" prop="name">
                    <el-input v-model="form.name" placeholder="活动标题"></el-input>
                </el-form-item>

                <el-form-item :label="'活动描述'">
                    <el-input v-model="form.summary" placeholder="活动描述"></el-input>
                </el-form-item>

                <el-form-item :label="'是否禁用'">
                    <el-switch
                        v-model="form.disable"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>

                <el-form-item :label="'文章详情'" style="margin-bottom: 30px;">
                    <Tinymce ref="editor" :height="400" v-model="form.teamDetail.content"
                             :http-request="httpRequest"
                             :is-from-edit="true"/>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
    import Tinymce from '../../../../components/Tinymce'
    import fileUpload from '../../../../components/file-upload'
    import { mapGetters } from 'vuex'
    import teamAPI from '../../../../api/teams'
    import Sticky from '@/components/Sticky'
    import { parseTime } from '@/utils/index.js'

    export default {
        components: { Tinymce, fileUpload, Sticky },
        data() {
            return {
                originForm: '',
                cover: {
                    fileList: []
                },
                form: {
                    id: '',
                    name: '',
                    disable: '',
                    max: '',
                    teamDetail: {
                        content: '',
                        contentType: ''
                    },
                    summary: '',
                    subject: '',
                    subjectId: '',
                    userId: '',
                    userName: ''
                },
                rules: {
                    name: [{ required: true, message: '标题不能为空', trigger: 'blur' }]
                },
                classifiesOptions: '',
                buttonDisabled: true,
                buttonLoading: false
            }
        },
        methods: {
            backToList() {
                this.$router.push(this.$route.matched[0].path + '/activity/team/' + this.$route.params.activityId)
            },
            httpRequest(options, onSuccess, onFail) {
                let isFromEdit = event.target.parentElement.parentElement.attributes['is-from-edit']
                let that = this
                let file = options.file
                let fileReader = new FileReader()
                if (file) {
                    fileReader.readAsDataURL(file)
                }
                fileReader.onload = () => {
                    let requestAPI = isFromEdit ? teamAPI.addContentImage : teamAPI.addCoverImage
                    let imageOptions = {
                        id: that.form.id,
                        userId: that.home.user.id,
                        base64: fileReader.result
                    }

                    requestAPI(imageOptions).then(function(response) {
                        if (_.isFunction(onSuccess)) {
                            onSuccess(response.data)
                        } else {
                            that.cover.fileList = [{
                                url: oss + response.data.uri
                            }]
                        }
                    }).catch(function(response) {
                        if (_.isFunction(onFail)) {
                            onFail(response)
                        }
                    })
                }
            },
            handleUpdate() {
                let that = this
                this.buttonLoading = true
                let form = _.cloneDeep(this.form)
                teamAPI.edit(form).then(function(response) {
                    that.buttonLoading = false
                    that.$notify({
                        title: '成功',
                        message: '更新成功',
                        type: 'success',
                        duration: 2000
                    })
                })
            },
            setForm(data) {
                let that = this
                Object.keys(that.form).forEach(item => {
                    if (item !== 'teamDetail') {
                        that.form[item] = data[item]
                        that.buttonDisabled = false
                    }
                })
                if (data.teamDetail) {
                    that.form.teamDetail.content = data.teamDetail.content
                }
            }
        },
        computed: {
            ...mapGetters([
                'home'
            ])
        },
        mounted() {
            let that = this
            let id = this.$route.params.id
            if (id) {
                teamAPI.teams(id).then(function(response) {
                    that.originForm = response.data
                    that.setForm(response.data)
                })
            }
        }
    }
</script>
