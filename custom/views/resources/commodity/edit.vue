<template>
    <div class="app-container">
        <el-form :rules="rules" ref="form" :model="form" label-position="left"
                 label-width="110px">
            <div class="sticky-box">
                <sticky :z-index="10" :class-name="'sticky-item'">
                    <select-classifies :value.sync="form.classifies" :search-type="'commodity'"></select-classifies>

                    <el-dropdown :show-timeout="100" trigger="click">
                        <el-button plain>
                            外链
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown" class="no-padding no-border" style="width:500px">
                            <el-form-item label-width="0px" style="margin-bottom: 0px">
                                <el-input v-model="form.sourceName" placeholder="来源名称">
                                    <template slot="prepend">
                                        来源名称
                                    </template>
                                </el-input>
                                <el-input v-model="form.sourceLink" placeholder="来源链接">
                                    <template slot="prepend">
                                        来源链接
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown :show-timeout="100" trigger="click">
                        <el-button plain>
                            {{ form.top?'评论: 已打开':'评论: 已关闭' }}
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown" class="no-padding">
                            <el-dropdown-item>
                                <el-radio-group v-model="form.top" style="padding: 10px;">
                                    <el-radio :label="true">
                                        打开评论
                                    </el-radio>
                                    <el-radio :label="false || null">
                                        关闭评论
                                    </el-radio>
                                </el-radio-group>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button size="medium" type="primary" :loading="buttonLoading" :disabled="buttonDisabled"
                               @click="handleUpdate">保存
                    </el-button>
                    <el-button size="medium" type="default" @click="backToList">返回</el-button>
                </sticky>
            </div>
            <div class="detail-form-box">
                <el-form-item :label="'名称'" prop="name">
                    <el-input v-model="form.name" placeholder="名称"></el-input>
                </el-form-item>

                <el-form-item :label="'价格'">
                    <el-input-number style="width:210px" v-model="form.price" :precision="4" :step="0.1"
                                     :max="9999999999.9999"></el-input-number>
                </el-form-item>

                <el-form-item :label="'划线价'">
                    <el-input-number style="width:210px" v-model="form.originalPrice" :precision="4" :step="0.1"
                                     :max="9999999999.9999"></el-input-number>
                </el-form-item>

                <el-form-item :label="'状态'">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="'DRAFT'">草稿</el-radio>
                        <el-radio :label="'LAUNCH'">发布</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item :label="'缩略图'">
                    <file-upload :http-request="httpRequest" :file-list="cover.fileList"></file-upload>
                </el-form-item>

                <el-form-item :label="'置顶'">
                    <el-switch
                        v-model="form.commentAble"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>

                <el-form-item :label="'内容摘要'">
                    <el-input v-model="form.summary" placeholder="内容摘要"></el-input>
                </el-form-item>


                <el-form-item :label="'文章详情'" style="margin-bottom: 30px;">
                    <Tinymce ref="editor" :height="400" v-model="form.commodityDetail.content"
                             :http-request="httpRequest"
                             :is-from-edit="true"/>
                </el-form-item>

            </div>

        </el-form>

    </div>
</template>

<script>
    import Tinymce from '../../../components/Tinymce'
    import fileUpload from '../../../components/file-upload'
    import { mapGetters } from 'vuex'
    import commoditiesAPI from '../../../api/commodities'
    import SelectClassifies from '../../../components/select-classifies'
    import Sticky from '@/components/Sticky'
    import * as uploadUtils from '../../../utils/upload'

    export default {
        components: { SelectClassifies, Tinymce, fileUpload, Sticky },
        data() {
            return {
                cover: {
                    fileList: []
                },
                form: {
                    id: '',
                    name: '',
                    originalPrice: 1,
                    price: 1,
                    summary: '',
                    commodityDetail: {
                        content: ''
                    },
                    sourceLink: '',
                    sourceName: '',
                    top: '',
                    commentAble: '',
                    classifies: [],
                    status: 'DRAFT'
                },
                rules: {
                    name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                    summary: [{ required: true, message: '摘要不能为空', trigger: 'blur' }]
                },
                classifiesOptions: '',
                buttonDisabled: true,
                buttonLoading: false
            }
        },
        methods: {
            backToList() {
                this.$router.push(this.$route.matched[0].path + '/commodity')
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
                    let requestAPI = isFromEdit ? commoditiesAPI.addContentImage : commoditiesAPI.addCoverImage
                    uploadUtils.compress(fileReader.result).then(function(imageData) {
                        let imageOptions = {
                            commodityId: that.form.id,
                            userId: that.home.user.id,
                            base64: imageData
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
                    })
                }
            },
            handleUpdate() {
                let that = this
                this.buttonLoading = true
                commoditiesAPI.edit(this.form).then(function(response) {
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
                    if (item !== 'commodityDetail') {
                        that.form[item] = data[item]
                        that.buttonDisabled = false
                    }
                })
                if (data.commodityDetail) {
                    that.form.commodityDetail.content = data.commodityDetail.content
                }
                if (data.image) {
                    that.cover.fileList = [{
                        url: oss + data.image
                    }]
                }
            },
            draft() {
                let that = this
                commoditiesAPI.draft(this.home.user.id).then(function(response) {
                    that.buttonDisabled = false
                    that.setForm(response.data)
                })
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
                commoditiesAPI.commodities(id).then(function(response) {
                    that.setForm(response.data)
                })
            } else {
                this.draft()
            }
        }
    }
</script>
