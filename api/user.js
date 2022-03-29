import { request } from '@/plugins/request'

// 登录
export const login = data => {
    return request({
        method: "POST",
        url: "/api/users/login",
        data
    });
}
// 注册
export const register = data => {
    return request({
        method: "POST",
        url: "/api/users",
        data
    });
}
// 获取用户
export const getUser = () => {
    return request({
        method: "GET",
        url: "/api/user"
    });
}
// 获取其他用户
export const getProfiles = (username) => {
    return request({
        method: "GET",
        url: `/api/profiles/${username}`
    });
}
// 关注用户
export const followProfiles = (username) => {
    return request({
        method: "POST",
        url: `/api/profiles/${username}/follow`
    });
}
// 取消关注用户
export const unFollowProfiles = (username)=>{
    return request({
        method:"DELETE",
        url: `/api/profiles/${username}/follow`
    })
}