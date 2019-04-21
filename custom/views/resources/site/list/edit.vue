<template>
    <div class="app-container">
        <el-form :rules="commonForm.rules" ref="commonForm" :model="commonForm.form" label-position="right"
                 label-width="120px"
                 class="detail-form-box">
            <el-form-item :label="'网站名称'" prop="name">
                <el-input v-model="commonForm.form.name" placeholder="网站名称"></el-input>
            </el-form-item>

            <el-form-item :label="'主题'" prop="siteTheme">
                <select-item :value.sync="commonForm.form.siteTheme" :options="themeOptions"></select-item>
            </el-form-item>

            <el-form-item :label="'摘要'">
                <el-input v-model="commonForm.form.summary" placeholder="摘要"></el-input>
            </el-form-item>

            <el-form-item :label="'网址'">
                <el-input v-model="commonForm.form.domain" placeholder="网址"></el-input>
            </el-form-item>

            <el-form-item :label="'联系电话'">
                <el-input v-model="commonForm.form.siteContact.phones" placeholder="联系电话"></el-input>
            </el-form-item>

            <el-form-item :label="'联系地址'">
                <el-input v-model="commonForm.form.siteContact.address" placeholder="联系地址"></el-input>
            </el-form-item>

            <el-form-item :label="'邮箱'">
                <el-input v-model="commonForm.form.siteContact.emails" placeholder="邮箱"></el-input>
            </el-form-item>

            <el-form-item :label="'网站备案号'">
                <el-input v-model="commonForm.form.registrationNo" placeholder="网站备案号"></el-input>
            </el-form-item>

            <el-form-item :label="'关于我们'" style="margin-bottom: 30px;">
                <Tinymce ref="editor" :height="400" v-model="commonForm.form.siteAbout.detail"/>
            </el-form-item>

        </el-form>

        <fix-bar :back-path="getBackPath()">
            <el-button type="primary" @click="saveData(commonForm)">更新</el-button>
        </fix-bar>
    </div>
</template>

<script>
    import Tinymce from '@/components/Tinymce'
    import {mapGetters} from 'vuex';
    import fixBar from '../../../../components/fix-bar'
    import selectItem from '../../../../components/select-item'

    let page = new pageInit(
        {
            components: {Tinymce, fixBar, selectItem},
            data: {
                themeOptions: {
                    method: 'get',
                    url: '/sites/themes',
                    params: {
                        page: 0,
                        size: 1000
                    }
                },
                apiQueryAddUrl: '/sites/add',
                apiQueryEditUrl: '/sites/edit/',
                initItemFormName: 'commonForm',
                commonForm: {
                    form: {
                        name: '',
                        summary: '',
                        domain: '',
                        registrationNo: '',
                        siteContact: {
                            phones: '',
                            address: '',
                            emails: ''
                        },
                        siteAbout: {
                            detail: ''
                        },
                        siteTheme: ''
                    },
                    rules: {
                        siteTheme: [{required: true, message: '请选择主题', trigger: 'blur'}],
                        name: [{required: true, message: '名称不能为空', trigger: 'blur'}]
                    },
                    formName: 'commonForm'
                }
            },
            methods: {
                beforeEdit() {
                    this.commonForm.form.userId = this.home.user.id;
                },
                getBackPath() {
                    return this.$route.matched[0].path + "/site";
                },
                beforeMounted() {
                    this.apiQueryUrl = '/sites/' + this.$route.params.id;
                },
                onDetailLoaded(response) {
                    let data = response.data;
                    this.commonForm.form = {
                        id: data.id,
                        name: data.name,
                        summary: data.summary,
                        domain: data.domain,
                        registrationNo: data.registrationNo,
                        siteContact: {
                            address: data.siteContact.address,
                            emails: data.siteContact.emails,
                            image: data.siteContact.image,
                            phones: data.siteContact.phones
                        },
                        siteAbout: {
                            detail: data.siteAbout.detail
                        },
                        siteTheme: data.siteTheme
                    };
                },
            },
            computed: {
                ...mapGetters([
                    'home',
                ])
            }
        }
    )
    export default page
</script>
