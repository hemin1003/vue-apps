#vue-apps 使用说明#

# 安装（建议先配置一个淘宝npm下载镜像地址：https://npm.taobao.org/
npm install

# 调试环境 serve with hot reload at http://localhost:8083
npm run dev

# 生产环境 build for production with minification
npm run build

#目录结构
	
	|---build/            		自动化构建脚本
	|---dist/             		默认发布根目录
		index.html          		访问地址http://localhost
		|---static/         		资源目录
			|---common.js
			|---common.css
			|---default.js
			|---default.css
			|---other.js
			|---other.css
		|---other/          		访问地址http://localhost/other
		 	|---index.html
	|---src/              		应用源码
		|---assets/         		资源目录
		 	|---imgs/         		公共图片
		  	|---font/         	字体图标
		  	|---config.js     	公共配置(name , logo...)
		  	|---global.less   	公共样式(reset...)
		  	|---lib.js        	各种框架(vue, vue-router, vux, jquery, fastclick...)
		|---components      		公共组件
			|---index-other.vue         
		|---apps            		单页面应用目录
		  	|---default
			    |---main.js     	当前应用入口
			    |---config.js     当前应用配置
			    |---app.vue       
			    !---page/
			    	|---page1.vue   路由页面组件
			    	|---page2.vue
			    |---vuex/       	应用状态管理
			      |---store.js
			      |---mutation-type.js
			      |---mutations.js
			      |---actions.js
			      |---getters.js
		  	|---other
		    	|---同index
			|---template.html   生成html模板


#参考
https://github.com/bluefox1688/vue-cli-multi-page	  
