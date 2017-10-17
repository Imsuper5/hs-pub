package com.hundsun.bkos.auth;

import java.util.List;

import com.common.cache.CacheManager;
import com.common.cache.ICache;
import com.hundsun.bkos.permission.dto.RoleRight;
import com.hundsun.bkos.permission.interfaces.IPermissionService;
import com.hundsun.bkos.permission.query.SysMenuQuery;
import com.hundsun.bkos.util.SpringUtil;

/**
 * 系统与URL的关系列表，用于判断请求是哪个系统的
 * 目前bkos-web只有询报价和公众号两个系统，所以此类只加载了公众号的权限URL，不在这个映射表里的都作为询报价的URL
 * @author xiexb
 *
 */
public class SysRightUrlMap {
	private static SysRightUrlMap _instance = new SysRightUrlMap();

	//所有公众号角色的权限URL
	private static ICache<String , RoleRight> officialUrls = CacheManager.getOrCreateCache("officialUrls", String.class, RoleRight.class);

	private volatile Boolean loaded = false;
	
	private SysRightUrlMap(){
	}
	
	public static SysRightUrlMap getInstance() {
		return _instance;
	}
	
	private void LoadRoleRight() {
		List<RoleRight> roleRights = getRoleRightList(7);
		for (RoleRight rr: roleRights) {
			officialUrls.put(rr.getModuleSubType() + rr.getUrl(), rr);
		}
	}
	
	public Boolean check(String url) {
		if (!loaded) {
			LoadRoleRight();
			loaded = true;
		}
		
		return officialUrls.containsKey(url);
		
	}
	
	private List<RoleRight> getRoleRightList(Integer roleId) {
		List<RoleRight> roleRightList = null;
		SysMenuQuery menuquery = new SysMenuQuery();
		menuquery.setRoleId(roleId);
		menuquery.setUseFlag("1");
		IPermissionService permService = SpringUtil.getBean(IPermissionService.class);
		roleRightList = permService.getRoleRight(menuquery).getRows();
		return roleRightList;
	}

}
