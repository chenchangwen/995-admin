<template>
    <div class="app-container">
        <el-form :rules="rules" ref="form" :model="form" label-position="left"
                 label-width="80px"
                 class="form-box">
            <el-form-item :label="'标题'" prop="title">
                <el-input v-model="form.title" placeholder="标题"></el-input>
            </el-form-item>

            <el-form-item :label="'作者'">
                <el-input v-model="form.author" placeholder="作者"></el-input>
            </el-form-item>

            <el-form-item :label="'缩略图'">
                <el-upload action=""
                           list-type="picture-card"
                           :http-request="httpRequest"
                           :file-list="cover.fileList">
                    <i class="el-icon-upload"></i>
                </el-upload>

            </el-form-item>


            <el-form-item :label="'置顶'">
                <el-switch
                        v-model="form.top"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                </el-switch>
            </el-form-item>


            <el-form-item :label="'内容摘要'">
                <el-input v-model="form.summary" placeholder="内容摘要"></el-input>
            </el-form-item>


            <el-form-item :label="'文章详情'" style="margin-bottom: 30px;">
                <Tinymce ref="editor" :height="400" v-model="form.articleDetail.content"/>
            </el-form-item>

            <el-form-item class="btn-box">
                <el-button size="medium" type="primary" :loading="buttonLoading" :disabled="buttonDisabled"
                           @click="handleUpdate">更新
                </el-button>
                <el-button size="medium" type="default" @click="backToList">返回</el-button>
            </el-form-item>

        </el-form>

    </div>
</template>

<script>
    import Tinymce from '@/components/Tinymce'
    import {mapGetters} from 'vuex';
    import articlesAPI from '../../../api/articles';

    export default {
        components: {Tinymce},
        data() {
            return {
                cover: {
                    fileList: []
                },
                form: {
                    id: '',
                    //作者
                    author: '',
                    //摘要
                    summary: '',
                    //标题
                    title: '',
                    //内容类型
                    contentType: '',
                    articleDetail: {
                        content: ''
                    },
                    //引用链接
                    sourceLink: '',
                    //引用名称
                    sourceName: '',
                    //是否置顶
                    top: false
                },
                rules: {
                    author: [{required: true, message: '作者不能为空', trigger: 'blur'}],
                    summary: [{required: true, message: '摘要不能为空', trigger: 'blur'}],
                    title: [{required: true, message: '标题不能为空', trigger: 'blur'}]
                },
                buttonDisabled: true,
                buttonLoading: false
            }
        },
        methods: {
            backToList() {
                this.$router.push(this.$route.matched[0].path + "/articles");
            },
            httpRequest(options) {
                let that = this;
                let file = options.file;
                let fileReader = new FileReader();
                if (file) {
                    fileReader.readAsDataURL(file)
                }
                fileReader.onload = () => {
                    let imageOptions = {
                        articleId: that.form.id,
                        userId: that.home.username,
                        base64: fileReader.result,
                    };

                    articlesAPI.addImage(imageOptions).then(function (response) {
                        that.cover.fileList = [{
                            url: oss + response.data.uri,
                        }]
                    })
                }
            },
            handleUpdate() {
                let that = this;
                this.buttonLoading = true;
                articlesAPI.edit(this.form).then(function (response) {
                    that.buttonLoading = false;
                    that.$notify({
                        title: '成功',
                        message: '更新成功',
                        type: 'success',
                        duration: 2000
                    })
                })
            },
            setForm(data) {
                let that = this;
                Object.keys(that.form).forEach(item => {
                    if (item !== 'articleDetail') {
                        that.form[item] = data[item];
                        that.buttonDisabled = false;
                    }
                });
                if (data.articleDetail) {
                    that.form.articleDetail.content = data.articleDetail.content;
                }
                if (data.image) {
                    that.cover.fileList = [{
                        url: oss + data.image,
                    }]
                }
            },
            draft() {
                let that = this;
                articlesAPI.draft(this.home.username).then(function (response) {
                    that.buttonDisabled = false;
                    that.setForm(response.data);
                })
            }
        },
        computed: {
            ...mapGetters([
                'home',
            ])
        },
        mounted() {
            let that = this;
            let id = this.$route.params.id;
            if (id) {
                articlesAPI.articles(id).then(function (response) {
                    that.setForm(response.data);
                })
            }
            else {
                this.draft();
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .form-box {
        padding: 30px 45px 20px 50px;
        width: 85%;
    }

    .btn-box {
        position: fixed;
        padding: 10px 30px;
        text-align: right;
        right: 0;
        bottom: 0;
        background: none;
        margin-bottom: 0;
    }
</style>