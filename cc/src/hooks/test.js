//fetch the github and look for the main branch
// https://api.github.com/repos/{owner}/{repo}
// example
// https://api.github.com/repos/yacine204/http_c 


const base_github_repo = "https://github.com/yacine204/http_c"

const api_base_github_repo = base_github_repo.replace("github.com", "api.github.com/repos")



const branches_api = api_base_github_repo + "/branches"





// const github_repo_fetch_url = "https://api.github.com/repos/yacine204/http_c/git/trees/master?recursive=1"


const fetch_handle = async()=>{
    try{

        const base_github_repo_res = await fetch(api_base_github_repo, {method:"GET"},)
        const github_repo_branches_res = await fetch(branches_api, {method:"GET"},)
        // const github_repo = await fetch(github_repo_fetch_url, {
        //     method: 'GET',
        // })
        const base_repo_data = await base_github_repo_res.json()
        const repo_branches_data = await github_repo_branches_res.json()

        

        // get all branches

        const branches = []

        for (let branch in repo_branches_data){
            branches[branch] = repo_branches_data[branch].name
        }
            
        
        console.log("repo branches: ", branches)
        
        console.log("/////////DATA////////")
        console.log(base_repo_data)
        console.log("/////////branches////////")
        console.log(repo_branches_data)
    }catch(err){
        console.log(err)
    }
}

await fetch_handle()
// const content = atob("CiNpZm5kZWYgUk9VVElOR19ICiNkZWZpbmUgUk9VVElOR19ICgojaW5jbHVk\nZSAiLi4vaW5jbHVkZS9yZXNwb25zZS5oIgojaW5jbHVkZSAiLi4vaW5jbHVk\nZS9yZXF1ZXN0LmgiCgpzdHJ1Y3QgUkVTUE9OU0Ugcm91dGluZyhzdHJ1Y3Qg\nUkVRVUVTVCByZXF1ZXN0KTsKCiNlbmRpZg==\n")
// console.log(content)