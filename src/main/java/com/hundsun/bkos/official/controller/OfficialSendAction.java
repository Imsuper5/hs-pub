package com.hundsun.bkos.official.controller;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONObject;
import com.common.cache.CacheManager;
import com.common.cache.CacheStategy;
import com.common.utils.PropsUtils;
import com.hundsun.bkos.base.MessageDTO;
import com.hundsun.bkos.base.PageDTO;
import com.hundsun.bkos.common.controller.BaseAction;
import com.hundsun.bkos.common.util.PrintImageSizeUtils;
import com.hundsun.bkos.official.dto.OfficialAccountMsgDTO;
import com.hundsun.bkos.official.dto.OfficialImgDTO;
import com.hundsun.bkos.official.dto.OfficialMessageDTO;
import com.hundsun.bkos.official.dto.SendMessageDTO;
import com.hundsun.bkos.official.dto.page.OfficialAccountMsgPageDTO;
import com.hundsun.bkos.official.interfaces.IOfficialService;
import com.hundsun.bkos.official.query.OfficialAccountMsgQuery;
import com.hundsun.bkos.official.utils.ContentType;
import com.hundsun.bkos.official.utils.ImgType;
import com.hundsun.bkos.official.utils.OkHttpUtils;
import com.hundsun.bkos.permission.annotation.Operation;
import com.hundsun.bkos.permission.dto.UserTokenDTO;
import com.hundsun.bkos.permission.util.EncodeDecodeUtil;

/**
 * 公众号消息发送处理Action
 * 
 * @author zhangyz19206
 * 
 */
@SuppressWarnings("unchecked")
@Controller
@RequestMapping("/official/officialsend")
public class OfficialSendAction extends BaseAction {
    @Autowired
    private IOfficialService officialService;
    @Value("${openfire.server}")
    private String openfireServer;
    @Value("${share.url}")
    private String shareurl;

    private static final Logger logger = LoggerFactory.getLogger(OfficialSendAction.class);
    // 允许的图片类型
    private static List<String> ALLOW_TYPE = Arrays.asList("image/jpg", "image/jpeg", "image/png");
    // 背景图片最大size
    private static int coverMaxsize = 4096000;
    // 公共号消息图片最大size
    private static int msgImgMaxsize = 1024000;

    private static String defautCharset = "UTF-8";

    private static String GBKCharset = "GBK";

    private static String offcialMsgUrl = "/official/officialsend/officialInfo.htm";

    private static String modelHtmlUrl = "/download/htmlcode.html";
    // 图片预览缓存Map
    public static Map<String, OfficialImgDTO> imgMap;
    // 发送公众号消息频率控制Map
    public static Map<String, Date> controlMap;
    
    public static Long sendlimitTime = PropsUtils.getLong("offical.sendMsg.limitTime");
    static {
        try {
            imgMap =
                    CacheManager.getOrCreateCache(CacheStategy.CACHE_PROVIDER_REDIS, "imgPubAvatarMap",
                            String.class, OfficialImgDTO.class);
            controlMap =
                    CacheManager.getOrCreateCache(CacheStategy.CACHE_PROVIDER_JVM, "controlMap",
                            String.class, Date.class, 100000L,
                            sendlimitTime);
        } catch (Exception e) {
            logger.error("CacheManager create error:" + e.getMessage());
        }
    }

    @RequestMapping("/officialsend.htm")
    @Operation(index = 40, roles = "7", code = "officialsend", name = "图文发送界面", desc = "图文发送界面")
    public void list(HttpServletRequest request, ModelMap model) {
        UserTokenDTO token = getUserToken(request);
        request.setAttribute("userIm", token.getUserNo());
        request.setAttribute("openfireServer", openfireServer);
    }

    @RequestMapping("/officialwordsend.htm")
    @Operation(index = 41, roles = "7", code = "officialwordsend", name = "文字发送界面", desc = "文字发送界面")
    public void list1(HttpServletRequest request, ModelMap model) {
        UserTokenDTO token = getUserToken(request);
        request.setAttribute("userIm", token.getUserNo());
        request.setAttribute("openfireServer", openfireServer);
    }

    @RequestMapping("/getOfficialMsgList.json")
    @ResponseBody
    @Operation(index = 42, roles = "7", code = "getOfficialMsgList", name = "获取/查询公众号已发消息列表", desc = "获取/查询公众号已发消息列表")
    public PageDTO<OfficialAccountMsgDTO> getOfficialMsgList(HttpServletRequest request,
            OfficialAccountMsgQuery query) {
        UserTokenDTO token = getUserToken(request);
        query.setIfRetRowCount(1);
        query.setOfficialAccountId(token.getUserId());
        PageDTO<OfficialAccountMsgDTO> pubPageDTO = new PageDTO<OfficialAccountMsgDTO>();
        MessageDTO message = new MessageDTO();
        if (StringUtils.isBlank(String.valueOf(query.getOfficialAccountId()))) {
            message.setSuccess(false);
            message.setMessage("参数异常");
            pubPageDTO.setMessage(message);
            return pubPageDTO;
        }
        pubPageDTO = officialService.getOfficialMsgList(query);
        message.setSuccess(true);
        pubPageDTO.setMessage(message);
        return pubPageDTO;
    }

    @RequestMapping("/addOfficialMsg.json")
    @Operation(index = 43, roles = "7", code = "addOfficialMsg", name = "新增公众号消息", desc = "新增公众号消息")
    public void addOfficialMsg(HttpServletRequest request, HttpServletResponse reponse,
            OfficialAccountMsgQuery query, String oper, String type) throws IOException {
        UserTokenDTO token = getUserToken(request);
        query.setOfficialAccountId(token.getUserId());
        MultipartFile file = query.getMyRelatedFile();
        SendMessageDTO message = new SendMessageDTO();
        OfficialMessageDTO offmsg = new OfficialMessageDTO();
        message.setSuccess(false);
        if (sendlimitTime != 0 && controlMap.containsKey(String.valueOf(token.getUserId()))) {
            message.setSuccess(false);
            message.setMessage("操作公众号消息太频繁,请稍后再试");
            reponse.getWriter().write(JSONObject.toJSONString(message));
        }
        if (StringUtils.isAnyBlank(query.getOfficialMsgTitleBase64Str())) {
            logger.error("addOfficialMsg params is not complete");
            message.setMessage("参数错误!");
            message.setSuccess(false);
            reponse.getWriter().write(JSONObject.toJSONString(message));
        }
        try {
            // 正文、标题、作者、摘要都由前端做base64编码，在此需要对其进行base64解码
            query.setOfficialMsgAuthor(new String(Base64.decodeBase64(query
                    .getOfficialMsgAuthorBase64Str().getBytes(defautCharset)), defautCharset));
            query.setOfficialMsgTitle(new String(Base64.decodeBase64(query
                    .getOfficialMsgTitleBase64Str().getBytes(defautCharset)), defautCharset));
            query.setOfficialMsgAbstract(new String(Base64.decodeBase64(query
                    .getOfficialMsgAbstractBase64Str().getBytes(defautCharset)), defautCharset));
            if (StringUtils.isNotBlank(query.getOfficialMsgBodyBase64Str())) {
                String bodyStrBase64 = query.getOfficialMsgBodyBase64Str();
                byte[] bodyStrByte = Base64.decodeBase64(bodyStrBase64.getBytes(defautCharset));
                String bodyStr = new String(bodyStrByte, defautCharset);
                query.setOfficialMsgBody(bodyStr.getBytes(GBKCharset));
                bodyStrByte = null;
            } else if (StringUtils.isNotBlank(query.getOfficialMsgBodyStr())) {
                query.setOfficialMsgBody(query.getOfficialMsgBodyStr().getBytes(GBKCharset));
            }
        } catch (Exception e1) {
            logger.error("addOfficialMsg msg decode error:");
            message.setMessage("消息发送失败!");
            message.setSuccess(false);
            reponse.getWriter().write(JSONObject.toJSONString(message));
        }
        offmsg.setImageURL("#");
        // 上传封面图片
        if (file != null && file.getSize() != 0) {
            if (!ALLOW_TYPE.contains(file.getContentType())) {
                logger.error("officialMsgUpload file type is not support:" + file.getContentType());
                message.setSuccess(false);
                message.setMessage("图片文件类型不支持.");
                reponse.getWriter().write(JSONObject.toJSONString(message));
            }
            if (file.getSize() > coverMaxsize) {
                message.setMessage("封面图片不能大于4M!");
                message.setSuccess(false);
                reponse.getWriter().write(JSONObject.toJSONString(message));
            }
            String key = OkHttpUtils.fileServesAuth(String.valueOf(System.currentTimeMillis()));
            String uuid = OkHttpUtils.multiPartFormDataUpload(file, key);
            if (StringUtils.isBlank(uuid)) {
                message.setMessage("封面图片上传失败");
                message.setSuccess(false);
                reponse.getWriter().write(JSONObject.toJSONString(message));
            }
            query.setOfficialMsgSrc(uuid);
            query.setImageData("0".getBytes());// 不知道为什么么需要上传imgData
            offmsg.setImageURL(OkHttpUtils.getFileDownPath() + "?resid=" + uuid);
        } else {
            if ("edit".equals(oper)) {
                offmsg.setImageURL(OkHttpUtils.getFileDownPath() + "?resid="
                        + query.getOfficialMsgSrc());
            }
        }
        query.setOfficialMsgUrl(offcialMsgUrl);

        OfficialAccountMsgDTO ret = new OfficialAccountMsgDTO();
        if ("edit".equals(oper)) {
            ret = officialService.updateOfficialMsg(query);
            ret.setOfficialAccountMsgId(query.getOfficialAccountMsgId());
        } else
            ret = officialService.addOfficialMsg(query);
        message.setSuccess(true);
        String hUrl = shareurl + request.getContextPath();

        offmsg.setMessageType("broadcast");
        if ("short".equals(type)) {
            offmsg.setText(EncodeDecodeUtil.htmlDecode(query.getOfficialMsgBodyStr()));
        } else {
            offmsg.setText(EncodeDecodeUtil.htmlDecode(query.getOfficialMsgAbstract()));
        }
        offmsg.setUrl("#");
        offmsg.setMsgType("5");
        offmsg.setTitle(query.getOfficialMsgTitle());
        offmsg.setUrl(hUrl + query.getOfficialMsgUrl() + "?msgId=" + ret.getOfficialAccountMsgId());
        String json = JSONObject.toJSONString(offmsg);
        message.setContent(json);
        message.setSuccess(true);
        reponse.setContentType("text/plain;charset=UTF-8");
        try {
			reponse.getWriter().write(JSONObject.toJSONString(message));
		} catch (IOException e) {
			e.printStackTrace();
		}
        if(sendlimitTime != 0){
        	controlMap.put(String.valueOf(token.getUserId()), new Date());
        }
    }

    @RequestMapping("/officialBodyImgUp.json")
    @ResponseBody
    @Operation(index = 44, roles = "7", code = "officialBodyImgUp", name = "消息体图片上传", desc = "消息体图片上传")
    public String officialBodyImgUp(HttpServletRequest request, HttpServletResponse response,
            OfficialImgDTO dto) {
        try {
            MultipartFile file = dto.getUpfile();
            if (file != null) {
                if (!ALLOW_TYPE.contains(file.getContentType())) throw new Exception("文件类型不支持");
                if (file.getSize() > msgImgMaxsize) throw new Exception("图片大小不能超过1M");

                String key = OkHttpUtils.fileServesAuth(String.valueOf(System.currentTimeMillis()));
                String uuid = OkHttpUtils.multiPartFormDataUpload(file, key);
                if (StringUtils.isBlank(uuid)) {
                    return uuid;
                }
            }
        } catch (Exception e) {
            logger.error("officialBodyImgUp upload img error:" + e.getMessage());
        }
        return "";
    }

    @RequestMapping("/officialMsgUpload.json")
    @Operation(index = 45, roles = "7", code = "officialMsgUpload", name = "上传图片缓存", desc = "上传图片缓存")
    public void officialMsgUpload(HttpServletRequest request, HttpServletResponse response,
            OfficialImgDTO dto) {
        MessageDTO message = new MessageDTO();
        response.setContentType("text/plain;charset=UTF-8");
        try {
            MultipartFile multipartFile = dto.getMyRelatedFile();// request.getFile("myRelatedFile");
            if (!ALLOW_TYPE.contains(multipartFile.getContentType())) {
                logger.error("officialMsgUpload file type is not support:"
                        + multipartFile.getContentType());
                message.setSuccess(false);
                message.setMessage("图片文件类型不支持.");
                response.getWriter().write(JSONObject.toJSONString(message));
                return;
            }
            if (multipartFile.getSize() <= 0) {
                logger.error("officialMsgUpload file size is null:" + multipartFile.getSize());
                message.setSuccess(false);
                message.setMessage("上传图片为空");
                response.getWriter().write(JSONObject.toJSONString(message));
                return;
            }
            if (multipartFile.getSize() > msgImgMaxsize) {
                logger.error("officialMsgUpload file size is not support:"
                        + multipartFile.getSize());
                message.setSuccess(false);
                message.setMessage("图片大小不能超过1M");
                response.getWriter().write(JSONObject.toJSONString(message));
                return;
            }
            // 获取上传图片的宽高
            BufferedImage bi = ImageIO.read(multipartFile.getInputStream());
            if (bi.getWidth() > 200 || bi.getHeight() > 200) {
                logger.error("officialMsgUpload file must between 200px-200px:" + bi.getWidth()
                        + ";" + bi.getHeight());
                message.setSuccess(false);
                message.setMessage("图片尺寸超过限制200x200以内像素.");
                response.getWriter().write(JSONObject.toJSONString(message));
                return;
            }
            String uploadfileName = multipartFile.getOriginalFilename();
            OfficialImgDTO query = new OfficialImgDTO();
            query.setUploadFileName(uploadfileName);
            // 将头像压缩成130x130像素
            ByteArrayInputStream in = new ByteArrayInputStream(multipartFile.getBytes());
            byte[] b =
                    PrintImageSizeUtils.compressImage(ImageIO.read(in), ImgType.JPG.getValue(),
                            130, 130).toByteArray();
            query.setImgByte(b);
            imgMap.put(request.getSession().getId(), query);
            message.setSuccess(true);
            b = null;
            response.getWriter().write(JSONObject.toJSONString(message));
        } catch (Exception e) {
            message.setSuccess(false);
            message.setMessage(e.getMessage());
            logger.error("上传公众号头像失败:" + e.getMessage());
        }
    }

    @RequestMapping("/uploadOfficialMsgBack.json")
    @ResponseBody
    @Operation(index = 46, roles = "7", code = "uploadOfficialMsgBack", name = "上传图片预览返回", desc = "上传图片预览返回")
    public ModelAndView uploadOfficialMsgBack(HttpServletRequest request, OfficialImgDTO query,
            HttpServletResponse response) {
        ByteArrayInputStream bis = null;
        OutputStream bos = null;
        try {
            String key = request.getSession().getId();
            OfficialImgDTO imgDto = imgMap.get(key);
            byte[] bb = imgDto.getImgByte();
            bis = new ByteArrayInputStream(bb);
            byte[] b = new byte[1024];
            bos = response.getOutputStream();
            int n;
            while ((n = bis.read(b)) != -1) {
                bos.write(b, 0, n);
            }
            BufferedImage image = new BufferedImage(200, 200, 1);
            response.setContentType(ContentType.IMG.getValue());
            response.setHeader("Pragma", "No-cache");
            response.setHeader("Cache-Control", "no-cache");
            ImageIO.write(image, ImgType.JPEG.getValue(), bos);
            bos.flush();
            b = null;
            bb = null;
        } catch (Exception e) {
            logger.error("uploadOfficialMsgBack upload img error" + e.getMessage());
        } finally {
            if (bis != null) {
                try {
                    bis.close();
                } catch (IOException e) {
                    e.printStackTrace();
                    logger.error("uploadOfficialMsgBack close InputStream error" + e.getMessage());
                }
            }
            if (bos != null) {
                try {
                    bos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                    logger.error("uploadOfficialMsgBack close OutputStream error" + e.getMessage());
                }
            }
        }
        return null;
    }

    @RequestMapping("/updateOfficialMsgStatus.json")
    @ResponseBody
    @Operation(index = 47, roles = "7", code = "updateOfficialMsgStatus", name = "修改公众号消息状态", desc = "修改公众号消息状态")
    public MessageDTO updateOfficialMsgStatus(HttpServletRequest request,
            OfficialAccountMsgQuery query) {
        MessageDTO message = new MessageDTO();
        officialService.updateOfficialMsgStatus(query);
        return message;
    }

    @RequestMapping("/officialInfo.htm")
    @ResponseBody
    @Operation(index = 48, roles = "", code = "officialInfo", name = "返回网页", desc = "返回网页")
    public void getOfficialHtml(HttpServletRequest request, HttpServletResponse response,
            OfficialAccountMsgQuery query) {
        OfficialAccountMsgDTO model = new OfficialAccountMsgDTO();
        String title = "", url = "", content = "", editer = "";
        try {
            query.setOfficialAccountMsgId(query.getMsgId());
            OfficialAccountMsgPageDTO page = officialService.getOfficialMsgList(query);
            List<OfficialAccountMsgDTO> list = new ArrayList<>();
            if (page != null && page.getRows() != null) list = page.getRows();
            if (list != null && list.size() > 0) {
                model = list.get(0);
                title = model.getOfficialMsgTitle();
                url = model.getOfficialSrcUrl();
                List<OfficialAccountMsgDTO> listBody = officialService.getOfficialMsgBody(query);
                if (listBody != null && listBody.size() > 0) {
                    byte[] b = listBody.get(0).getOfficialMsgBody();
                    model.setOfficialMsgBodyStr(b == null ? null : new String(b, GBKCharset));
                    b = null;
                }
                content = model.getOfficialMsgBodyStr();
                editer = model.getOfficialMsgAuthor();
            } else {
                title = "文章不存在或已删除！";
            }
        } catch (UnsupportedEncodingException e) {
            logger.error("officialInfo html web error" + e.getMessage());
            return;
        }
        writeHtml(request, response, title, url, content, editer);
    }

    @Deprecated
    @RequestMapping("/officialBeforInfo.htm")
    @ResponseBody
    @Operation(index = 49, roles = "", code = "officialBeforInfo", name = "返回网页", desc = "返回网页")
    public void getBeforOfficialHtml(HttpServletRequest request, HttpServletResponse response,
            String title, String url, String editer, String content) {
        try {
            writeHtml(request, response, title, url, content, editer);
        } catch (Exception e) {
            logger.error("officialBeforInfo html web error" + e.getMessage());
            return;
        }

    }

    /**
     * 生成公众号消息网页
     * 
     * @param request
     * @param response
     * @param title
     * @param url
     * @param content
     * @param editer
     */
    private void writeHtml(HttpServletRequest request, HttpServletResponse response, String title,
            String url, String content, String editer) {
        String requesturl = request.getRequestURL().toString();
        String hUrl = requesturl.substring(0, requesturl.indexOf("/official/"));
        //替换换行符
        content = content.replaceAll("\r\n", "<br>");
        content = content.replaceAll("\n", "<br>");
        if (StringUtils.isBlank(title)) {
            logger.error("officialBeforInfo  write html web error,params is not complete");
            return;
        }
        url = StringUtils.isBlank(url) ? "#" : url;
        try {
            // 模板路径
            String lostUrl = request.getSession().getServletContext().getRealPath("");
            String filePath = lostUrl + modelHtmlUrl;
            String templateContent = "";
            // 读取模板文件
            FileInputStream fileinputstream = new FileInputStream(filePath);
            int lenght = fileinputstream.available();
            byte[] bytes = new byte[lenght];
            fileinputstream.read(bytes);
            fileinputstream.close();
            templateContent = new String(bytes, defautCharset);
            templateContent =
                    templateContent.replaceAll("###appServer###",
                            java.util.regex.Matcher.quoteReplacement(hUrl));
            templateContent =
                    templateContent.replaceAll("###title###",
                            java.util.regex.Matcher.quoteReplacement(title));
            templateContent =
                    templateContent.replaceAll("###url###",
                            java.util.regex.Matcher.quoteReplacement(url));
            templateContent =
                    templateContent.replaceAll("###content###",
                            java.util.regex.Matcher.quoteReplacement(content));
            templateContent =
                    templateContent.replaceAll("###author###",
                            java.util.regex.Matcher.quoteReplacement(editer));
            // 使用平台的默认字符集将此 String 编码为 byte 序列，并将结果存储到一个新的 byte 数组中。
            byte[] tagBytes = templateContent.getBytes(defautCharset);

            // 建立文件输出流
            OutputStream out;
            response.setCharacterEncoding(defautCharset);
            response.setContentType(ContentType.TEXT.getValue());
            // 2.设置文件头：最后一个参数是设置下载文件名
            response.setHeader("Content-Disposition", "inline" + "; filename=\"公众号消息\"");
            out = response.getOutputStream();
            out.write(tagBytes);
            out.flush();
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("officialBeforInfo  write html web error" + e.getMessage());
        }
    }

    @RequestMapping("/getOfficialImg.json")
    @ResponseBody
    @Operation(index = 38, roles = "", code = "getOfficialImg", name = "获取/查询公众号图片", desc = "获取/查询公众号图片")
    public void getOfficialImg(HttpServletResponse response, OfficialAccountMsgQuery query)
            throws Exception {
        OutputStream toClient;
        toClient = response.getOutputStream();
        response.setContentType(ContentType.IMG.getValue());
        if (StringUtils.isBlank(String.valueOf(query.getOfficialMsgSrc()))) {
            return;
        }
        if (StringUtils.isNotBlank(query.getOfficialMsgSrc())) {
            toClient.write(OkHttpUtils.multiPartFormDataDown(query.getOfficialMsgSrc()));
        }
        toClient.flush();
        toClient.close();
    }

    @RequestMapping("/getOfficialBody.json")
    @ResponseBody
    @Operation(index = 39, roles = "", code = "getOfficialBody", name = "获取/查询公众号图片", desc = "获取/查询公众号图片")
    public OfficialAccountMsgDTO getOfficialBody(HttpServletResponse response,
            OfficialAccountMsgQuery query) throws Exception {
        OfficialAccountMsgDTO model = new OfficialAccountMsgDTO();
        if (StringUtils.isBlank(String.valueOf(query.getMsgId()))) {
            return model;
        }
        query.setOfficialAccountMsgId(query.getMsgId());
        List<OfficialAccountMsgDTO> list = officialService.getOfficialMsgBody(query);
        if (list != null && list.size() > 0) {
            model = list.get(0);
        }
        byte[] b = model.getOfficialMsgBody();
        model.setOfficialMsgBodyStr(b == null ? null : new String(b, GBKCharset));
        return model;
    }
}
