package com.hundsun.bkos.quoted.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hundsun.bkos.base.MessageDTO;
import com.hundsun.bkos.common.controller.BaseAction;
import com.hundsun.bkos.common.services.im.MessageSender;
import com.hundsun.bkos.permission.annotation.Operation;
import com.hundsun.bkos.permission.dto.UserTokenDTO;
import com.hundsun.bkos.permission.util.EncodeDecodeUtil;

@Controller
@RequestMapping("/quoted/quoted")
public class QuotedAction extends BaseAction {
	@Value("${openfire.server}")
	private String openfireServer;

	@Autowired
	private MessageSender msgSender;

	private final static Logger logger = LoggerFactory
			.getLogger(QuotedAction.class);

	@RequestMapping("/sendXmppMsg.json")
	@ResponseBody
	@Operation(index = 100, roles = "7", code = "sendXmppMsg", name = "发送IM消息", desc = "发送IM消息")
	public MessageDTO sendXmppMsg(HttpServletRequest request, String jids,
			String content) {
		//发送IM之前对content内容进行html解码
		content = EncodeDecodeUtil.htmlDecode(content);
		MessageDTO message = new MessageDTO();
		message.setSuccess(true);
		UserTokenDTO token = getUserToken(request);
		String userJid = token.getUserNo() + "@" + openfireServer;
		// 设置服务器地址
		String[] jid = jids.split(",");
		logger.debug("sendstart:" + token.getUserNo() + "," + jid.length);
		for (int i = 0; i < jid.length; i++) {
			String tojid = jid[i];
			if (!StringUtils.isBlank(tojid)) {
				org.xmpp.packet.Message m = new org.xmpp.packet.Message();
				m.setFrom(userJid);
				m.setBody(content);
				m.setTo(tojid);
				m.setType(org.xmpp.packet.Message.Type.groupchat);
				msgSender.sendMessage(m);
				logger.debug("from:" + token.getUserNo() + ",to:" + tojid
						+ ",index:" + i + "," + content);
			}
		}
		return message;
	}
}
