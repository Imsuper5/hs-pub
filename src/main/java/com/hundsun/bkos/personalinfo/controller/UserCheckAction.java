package com.hundsun.bkos.personalinfo.controller;

import java.io.FileInputStream;
import java.io.OutputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hundsun.bkos.common.controller.BaseAction;
import com.hundsun.bkos.common.dto.AdjunctDTO;
import com.hundsun.bkos.common.interfaces.IPublicShareService;
import com.hundsun.bkos.common.query.AdjunctQuery;
import com.hundsun.bkos.official.utils.OkHttpUtils;
import com.hundsun.bkos.permission.annotation.Operation;

@Controller
@RequestMapping("/personalinfo/userCheck")
public class UserCheckAction extends BaseAction {
    @Autowired
    private IPublicShareService shareService;
	

	@RequestMapping("/userApplyAdjunct.json")
	@ResponseBody
	@Operation(index = 90, roles = "7", code = "userApplyAdjunct", name = "获取/查询系统用户附件", desc = "获取/查询系统用户附件")
	public void userApplyAdjunct(HttpServletRequest request,
			HttpServletResponse response, AdjunctQuery query) throws Exception {

		List<AdjunctDTO> list = shareService.userApplyAdjunct(query);

		if (list != null && list.size() > 0) {
			for (AdjunctDTO item : list) {
				byte[] b = item.getAdjuncdData();
				String uuid = item.getAdjuncdSuffix();
				if(b.length < 200 && StringUtils.isNotBlank(uuid)){
					b = OkHttpUtils.multiPartFormDataDown(uuid);
				}
				OutputStream toClient;
				response.setContentType("image/jpeg");
				toClient = response.getOutputStream();
				// 输出数据
				toClient.write(b);
				toClient.flush();
				toClient.close();
			}
		} else {
			String path = request.getSession().getServletContext()
					.getRealPath("");
			String url = path + "/img/nopic.jpg";
			FileInputStream hFile = new FileInputStream(url);
			// 得到文件大小
			int i = hFile.available();
			byte data[] = new byte[i];
			// 读数据
			hFile.read(data);			
			// 得到向客户端输出二进制数据的对象
			OutputStream toClient = response.getOutputStream();
			// 输出数据
			toClient.write(data);
			toClient.flush();
			toClient.close();
			hFile.close();
		}
	}

}
