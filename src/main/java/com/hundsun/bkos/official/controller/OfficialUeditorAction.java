package com.hundsun.bkos.official.controller;



import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSONObject;
import com.common.utils.PropsUtils;
import com.hundsun.bkos.common.controller.BaseAction;
import com.hundsun.bkos.official.dto.OfficialImgDTO;
import com.hundsun.bkos.official.dto.ReturnUploadImageDTO;
import com.hundsun.bkos.official.utils.OkHttpUtils;
import com.hundsun.bkos.permission.annotation.Operation;

@Controller
@RequestMapping("/ueditor")
public class OfficialUeditorAction extends BaseAction {
	
	private static Logger logger = LoggerFactory.getLogger(OfficialUeditorAction.class);
	
	private static String imgUrlprefix = PropsUtils.get("fs.server.host") +":"+ PropsUtils.get("fs.server.port") +"/"+PropsUtils.get("fs.server.path")+PropsUtils.get("fs.client.down.path");
	
	@RequestMapping("/officialBodyImgUp.json")
	@Operation(index = 60, roles = "7", code = "officialBodyImgUp", name = "编辑器消息体图片上传", desc = "编辑器消息体图片上传")
    public void upload(HttpServletRequest request, HttpServletResponse response,OfficialImgDTO dto) throws Exception {  
		MultipartFile file = dto.getUpfile();
		ReturnUploadImageDTO rui = new ReturnUploadImageDTO();
		rui.setState("FAIL");
		if(file != null){
			rui.setOriginal(file.getName());
			rui.setOriginal(file.getName());
			String key = OkHttpUtils.fileServesAuth(String.valueOf(System.currentTimeMillis()));
			String uuid = OkHttpUtils.multiPartFormDataUpload(file,key);
			if(StringUtils.isBlank(uuid)){
				logger.error("officialBodyImgUp upload error");
				rui.setState("FAIL");
			}else{
				rui.setState("SUCCESS");
				rui.setUrl("http://"+imgUrlprefix+"?resid="+uuid);
			}
		}
		response.setContentType("text/plain;charset=UTF-8");
		response.getWriter().write(JSONObject.toJSONString(rui));
	}
}
