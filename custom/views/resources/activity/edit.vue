<template>
    <div class="app-container">
        <el-form :rules="rules" ref="form" :model="form" label-position="left"
                 label-width="110px">
            <div class="sticky-box">
                <sticky :z-index="10" :class-name="'sticky-item'">
                    <el-button size="medium" type="primary" :loading="buttonLoading" :disabled="buttonDisabled"
                               @click="handleUpdate">发布
                    </el-button>
                    <el-button size="medium" type="default" @click="backToList">返回</el-button>
                </sticky>
            </div>
            <div class="detail-form-box">
                <el-form-item :label="'活动ID'">
                    {{form.id}} (系统级,不可更改)
                </el-form-item>

                <el-form-item :label="'状态'">
                    <el-select v-model="form.status" placeholder="状态" style="width: 200px">
                        <el-option
                            v-for="item in statusOptions"
                            :key="item"
                            :label="item.value"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="'分类'">
                    <el-select v-model="form.categories" value-key="id" multiple placeholder="分类" style="width: 200px">
                        <el-option
                            v-for="item in categories"
                            :key="item.id "
                            :label="item.name"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>



                <el-form-item :label="'活动标题'" prop="name">
                    <el-input v-model="form.name" placeholder="活动标题"></el-input>
                </el-form-item>

                <el-form-item :label="'活动描述'">
                    <el-input v-model="form.summary" placeholder="活动描述"></el-input>
                </el-form-item>

                <el-form-item :label="'封面图'">
                    <file-upload :http-request="httpRequest" :file-list="cover.fileList"
                                 :tip-text="'参考尺寸: 750*350px,4M以内'"></file-upload>
                </el-form-item>

                <el-form-item :label="'微信二维码'">
                    <file-upload :http-request="httpRequest" :file-list="contact.fileList" :tip-text="'让成员找到你'"
                                 :name="'contact'"></file-upload>
                </el-form-item>

                <el-form-item :label="'价格'">
                    <el-input-number style="width:210px" v-model="form.price" :precision="4" :step="0.1"
                                     :max="9999999999.9999"></el-input-number>
                </el-form-item>

                <el-form-item :label="'活动地点'" prop="activityContact.detailed">
                    <el-input v-model="form.activityContact.detailed" placeholder="活动地点"></el-input>
                </el-form-item>

                <el-form-item :label="'原价(划线价)'">
                    <el-input-number style="width:210px" v-model="form.originalPrice" :precision="4" :step="0.1"
                                     :max="9999999999.9999"></el-input-number>
                </el-form-item>

                <el-form-item :label="'报名截止时间'" prop="enrollEndTime">
                    <el-date-picker v-model="form.enrollEndTime" type="datetime" value-format="yyyy-MM-dd hh:mm:ss"
                                    placeholder="报名截止时间"
                                    :picker-options="enrollEndTimeOptions">
                    </el-date-picker>
                </el-form-item>

                <el-form-item :label="'活动开始时间'" prop="beginTime">
                    <el-date-picker v-model="form.beginTime" type="datetime" value-format="yyyy-MM-dd hh:mm:ss"
                                    placeholder="活动开始时间"
                                    :picker-options="beginTimeOptions">
                    </el-date-picker>
                </el-form-item>

                <el-form-item :label="'活动结束时间'" prop="endTime">
                    <el-date-picker v-model="form.endTime" type="datetime" value-format="yyyy-MM-dd hh:mm:ss"
                                    placeholder="活动结束时间"
                                    :picker-options="endTimeOptions">
                    </el-date-picker>
                </el-form-item>

                <el-form-item :label="'人数上限'">
                    <el-input-number style="width:210px" v-model="form.max" :step="1"
                                     :max="9999999999"></el-input-number>
                </el-form-item>

                <el-form-item :label="'联系电话'">
                    <el-input v-model="form.activityContact.phones" placeholder="联系电话"></el-input>
                </el-form-item>

                <el-form-item :label="'开启众筹支付'">
                    <el-switch
                        v-model="form.crowdAble"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>

                <el-form-item :label="'推荐人分拥'">
                    <el-input-number style="width:210px" v-model="form.kickback" :precision="4" :step="0.1"
                                     :max="9999999999.9999"></el-input-number>
                </el-form-item>



                <el-form-item :label="'文章详情'" style="margin-bottom: 30px;">
                    <Tinymce ref="editor" :height="400" v-model="form.activityDetail.content"
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
    import activitiesAPI from '../../../api/activities'
    import Sticky from '@/components/Sticky'
    import { parseTime } from '@/utils/index.js'
    import * as uploadUtils from '../../../utils/upload'

    export default {
        components: { Tinymce, fileUpload, Sticky },
        data() {
            return {
                categories: [],
                statusOptions: [
                    {
                        value: 'NEW',
                        label: 'NEW'
                    },
                    {
                        value: 'LAUNCH',
                        label: 'LAUNCH'
                    },
                    {
                        value: 'DISABLE',
                        label: 'DISABLE'
                    },
                    {
                        value: 'SUCCESS',
                        label: 'SUCCESS'
                    }
                ],
                originForm: '',
                enrollEndTimeOptions: {
                    disabledDate: (time) => {
                        return time.getTime() > this.form.beginTime
                    }
                },
                beginTimeOptions: {
                    disabledDate: (time) => {
                        if (this.form.endTime) {
                            return time.getTime() > this.form.endTime
                        } else {
                            return time.getTime() < this.form.endTime
                        }
                    }
                },
                endTimeOptions: {
                    disabledDate: (time) => {
                        return time.getTime() < this.form.beginTime
                    }
                },
                cover: {
                    fileList: []
                },
                contact: {
                    fileList: []
                },
                form: {
                    id: '',
                    name: '',
                    crowdAble: '',
                    kickback: 0.0,
                    originalPrice: 1,
                    price: 1,
                    summary: '',
                    max: 1,
                    userId: '',
                    activityDetail: {
                        content: ''
                    },
                    activityContact: {
                        detailed: '',
                        image: '',
                        phones: ''
                    },
                    categories: [],
                    enrollEndTime: '',
                    beginTime: '',
                    endTime: '',
                    status: ''
                },
                rules: {
                    name: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
                    enrollEndTime: [{ required: true, message: '报名截止时间', trigger: 'blur' }],
                    beginTime: [{ required: true, message: '请选择活动开始时间', trigger: 'blur' }],
                    endTime: [{ required: true, message: '活动结束时间', trigger: 'blur' }],
                    'activityContact.detailed': [{ required: true, message: '活动地点不能为空', trigger: 'blur' }]
                },
                classifiesOptions: '',
                buttonDisabled: true,
                buttonLoading: false
            }
        },
        methods: {
            backToList() {
                this.$router.push(this.$route.matched[0].path + '/activity')
            },
            httpRequest(options, onSuccess, onFail) {
                let isFromEdit = event.target.parentElement.parentElement.attributes['is-from-edit']
                let targetName = event.target.name
                let that = this
                let file = options.file
                let fileReader = new FileReader()
                if (file) {
                    fileReader.readAsDataURL(file)
                }
                fileReader.onload = () => {
                    let requestAPI = isFromEdit ? activitiesAPI.addContentImage : activitiesAPI.addCoverImage
                    uploadUtils.compress(fileReader.result).then(function(imageData) {
                        if (targetName === 'contact') {
                            requestAPI = activitiesAPI.addContactImage
                        }
                        let imageOptions = {
                            activityId: that.form.id,
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
                let form = _.cloneDeep(this.form)
                delete form.activityContact.activityId
                delete form.activityContact.third
                delete form.activityContact.image
                delete form.activityContact.id
                form.enrollEndTime = parseTime(form.enrollEndTime, '{y}-{m}-{d} {h}:{i}:{s}')
                form.beginTime = parseTime(form.beginTime, '{y}-{m}-{d} {h}:{i}:{s}')
                form.endTime = parseTime(form.endTime, '{y}-{m}-{d} {h}:{i}:{s}')

                // var arr = new Array()
                // arr.push(form.categories);
                // form.categories = arr
                activitiesAPI.edit(form).then(function(response) {
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
                    if (item !== 'activityDetail') {
                        that.form[item] = data[item]
                        that.buttonDisabled = false
                    }
                })
                that.form.enrollEndTime = new Date(that.form.enrollEndTime)
                that.form.beginTime = new Date(that.form.beginTime)
                that.form.endTime = new Date(that.form.endTime)
                if (data.activityDetail) {
                    that.form.activityDetail.content = data.activityDetail.content
                }
                if (data.activityContact) {
                    if (data.activityContact.image) {
                        that.contact.fileList = [{
                            url: oss + data.activityContact.image
                        }]
                    }
                }
                if (data.image) {
                    that.cover.fileList = [{
                        url: oss + data.image
                    }]
                }
            }
        },
        computed: {
            ...mapGetters([
                'home'
            ])
        },
        mounted() {

            // loadActivities();
            let that = this
            let id = this.$route.params.id
            if (id) {
                activitiesAPI.activities(id).then(function(response) {
                    that.originForm = response.data
                    that.setForm(response.data)
                })
            }
        },
        created(){
            let that = this;
            let option = {
                method: 'get',
                url: `/categories?search=subject==activity`,
                params: {
                    page: 0,
                    size: 1000
                }
            };

            request(option).then(function (response) {

                console.log(response)
                for(var i=0;i<response.data.length;i++){
                    that.categories.push(response.data[i]);
                }
                // for(var i=0;i<result.length;i++){
                //     that.categories.push({});
                // }
            });
        }
    }
</script>
