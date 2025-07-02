import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from './models/user.js';
import { message } from 'antd';
const app = express();
app.use(express.json());
app.use(cors());
// 修改数据库连接配置
mongoose.connect('mongodb://127.0.0.1:27017/heritage', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ 已连接到数据库:', mongoose.connection.name);
    // 测试数据库连接
    mongoose.connection.db.listCollections().toArray((err, collections) => {
        console.log('现有集合:', collections.map(c => c.name));
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
}); 
//schema的定义要与数据库字段对齐
const heritageSchema = new mongoose.Schema({
    id: Number,
    name: String,
    protection_unit: String,
    category: String,
    region: String,
    description: String,
    imgUrl: String,
    comments: [{
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        content: String,
        username: String,
        date: Date
    }],
    ratings: [{
        username: String,
        rating: Number,
        date: Date
    }],
    likes: {
        type: [{
            username: String,
            date: Date
        }],
        default: []
    }
}, {collection: 'heritage'});


// 修改点赞接口
app.post('/api/heritage/:id/like', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { username } = req.body;
        const Heritage = mongoose.model('heritage');
        
        // 先查询文章是否存在
        const heritage = await Heritage.findOne({ id: id });
        
        if (!heritage) {
            return res.status(404).json({
                status: 404,
                message: '未找到相关文章'
            });
        }

        // 检查用户是否已经点赞
        const hasLiked = heritage.likes && heritage.likes.some(like => like.username === username);
        if (hasLiked) {
            return res.status(400).json({
                status: 400,
                message: '您已经点赞过了'
            });
        }
        // 确保likes是数组
        if (!Array.isArray(heritage.likes)) {
            heritage.likes = [];
        }

        // 添加点赞
        heritage.likes.push({
            username,
            date: new Date()
        });

        // 保存更新
        await heritage.save();

        res.json({
            status: 200,
            message: '点赞成功',
            data: heritage.likes.length
        });
    } catch (error) {
        console.error('点赞失败:', error);
        res.status(500).json({message: '服务器错误'});
    }
});

// 修改删除评论接口
app.delete('/api/heritage/:id/comments/:commentId', async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const Heritage = mongoose.model('heritage');
        
        // 修改查询方式，确保正确匹配评论ID
        const updatedHeritage = await Heritage.findOneAndUpdate(
            { id: parseInt(id) }, 
            { 
                $pull: { 
                    comments: { 
                        _id: new mongoose.Types.ObjectId(commentId.toString()) 
                    } 
                } 
            },
            { new: true }
        );

        if (!updatedHeritage) {
            return res.status(404).json({
                status: 404,
                message: '未找到相关评论'
            });
        }

        // 确认删除是否成功
        const commentExists = updatedHeritage.comments.some(
            comment => comment._id.toString() === commentId
        );

        if (commentExists) {
            return res.status(500).json({
                status: 500,
                message: '评论删除失败'
            });
        }

        res.status(200).json({
            status: 200,
            message: '评论删除成功',
            data: updatedHeritage.comments
        });
    } catch (error) {
        console.error('删除评论失败:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
mongoose.model('heritage', heritageSchema);

//token校验中间件
function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: '未登录或token缺失' });
    try {
        const decoded = jwt.verify(token, 'secret');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'token无效或已过期' });
    }
}

//实现用户登录
app.post('/api/login', async (req, res) => {
    try{
        console.log('收到登录请求:', req.body);
       //1 获取登录凭证
    const {username, password} = req.body;
    //2 查找用户
    const user=await User.findOne({username})
    if (!user) {
        return res.status(401).json({ message: '用户名或密码错误' });
    }
    //3 验证密码
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ message: '用户名或密码错误' });
    }
    //4 生成token（30天）
    const token = jwt.sign({ username, id: user._id }, 'secret', { expiresIn: '30d' });
    //5 返回响应
    res.json({
        status: 200,
        message: '登录成功',
        token,
        user: {
            username: user.username,
            isAdmin: user.isAdmin,
            avatar: user.avatar,
            bio: user.bio,
            address: user.address
        }
    })
    }catch (error) {
        console.error('登录失败:', error);
        res.status(500).json({ message: '服务器错误' });
    }
    
})
//用户注册接口
// 添加调试日志
app.post('/api/register', async (req, res) => { 
    try {
        console.log('收到注册请求:', req.body);
        const { username, password } = req.body;
        
        if (!username || !password) {  // 添加参数验证
            return res.status(400).json({ 
                message: '用户名和密码不能为空' 
            });
        }
        //检查是否存在这个用户
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: '用户已存在' });
        }

        //创建用户
        const newUser = new User({
            username,
            password,
            isAdmin: false
        });
        
        console.log('准备保存用户:', newUser); // 添加日志
        
        //保存用户
        const savedUser = await newUser.save();
        console.log('用户保存成功:', savedUser); // 添加日志
        //生成token
        const token=jwt.sign({username},'secret',{expiresIn:'24h'})
        //保存用户
        await newUser.save();
        res.json({
            status: 200,
            message: '注册成功',
            token,
            user: {
                username: newUser.username,
                isAdmin: newUser.isAdmin
            }
        })
    }catch (error) {
        console.error('注册失败，详细错误:', error); // 更详细的错误日志
        res.status(500).json({ 
            message: '服务器错误',
            error: error.message  // 返回具体错误信息
        });
    }
});
//获取非遗文章信息接口
app.get('/api/heritage', async (req, res) => { 
    try{
        const Heritage = await mongoose.model('heritage').find();
        const fomattedData = Heritage.map(item=>({
            id:item.id,
            name:item.name,
            protection_unit:item.protection_unit,
            category:item.category,
            region:item.region,
            dec: item.description,
            imgUrl:item.imgUrl,
            comments: item.comments || [],  // 添加评论
            ratings: item.ratings || []    // 添加评分
        }))
        res.json({
            status: 200,
            message: '获取非遗文章信息成功',
            data: fomattedData
        })
    }catch (error) {
        console.error('获取非遗文章信息失败:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
// 根据id查询非遗文章信息接口 - 修改返回评论和评分
app.get('/api/heritage/:id', async (req, res) => {
    try{
        const id=parseInt(req.params.id);
        if(isNaN(id)){
            return res.status(400).json({status:400, message: '无效的ID' });
        }
        const heritage=await mongoose.model('heritage').findOne({id:id})
        if(!heritage){
            return res.status(404).json({
                status:404,
                message:`未找到ID为${id}的非遗文章信息`
            })
        };
        const formattedData={
            id:heritage.id,
            name:heritage.name,
            protection_unit:heritage.protection_unit,
            category:heritage.category,
            region:heritage.region,
            dec:heritage.description,
            imgUrl:heritage.imgUrl,
            comments: heritage.comments || [],  // 添加评论
            ratings: heritage.ratings || []  ,  // 添加评分,
            likes: heritage.likes || 0
        }
        res.json({
            status:200,
            message:'获取非遗文章信息成功',
            data:formattedData
        })
    } catch (error) {
        console.error('获取非遗文章信息失败:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 添加评论接口 - 修改为使用正确的模型
app.post('/api/heritage/:id/comments', async (req, res) => { 
    try{
        const {content, username} = req.body;  // 从请求体中获取用户名
        const id=parseInt(req.params.id);
        if(isNaN(id)){
            return res.status(400).json({status:400, message: '无效的ID' });
        }
        const newComment={
            content,
            username,
            date:new Date()
        }
        const Heritage = mongoose.model('heritage');
        const updatedHeritage=await Heritage.findOneAndUpdate(
            {id:id},
            {$push:{comments:newComment}}, 
            {new:true}
        )
        res.status(200).json({
            status:200,
            message:'评论添加成功',
            data:updatedHeritage.comments
        })
    } catch (error) {
        console.error('评论添加失败:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 新增评分接口
app.post('/api/heritage/:id/ratings', async (req, res) => {
    try{
        const {rating, username} = req.body;  // 评分值(1-5)和用户名
        const id=parseInt(req.params.id);
        
        if(isNaN(id)){
            return res.status(400).json({status:400, message: '无效的ID' });
        }
        if(!rating || rating < 1 || rating > 5){
            return res.status(400).json({status:400, message: '评分必须在1-5之间' });
        }
        
        const newRating={
            rating,
            username,
            date:new Date()
        }
        
        const Heritage = mongoose.model('heritage');
        const updatedHeritage=await Heritage.findOneAndUpdate(
            {id:id},
            {$push:{ratings:newRating}},
            {new:true}
        )
        
        // 计算平均评分
        const ratings = updatedHeritage.ratings || [];
        const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        
        res.status(200).json({
            status:200,
            message:'评分添加成功',
            data:{
                ratings: updatedHeritage.ratings,
                averageRating: avgRating.toFixed(1)
            }
        })
    } catch (error) {
        console.error('评分添加失败:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
//测试接口
app.get('/api/login', (req, res) => {
    res.send('请使用 POST 方法登录');
});
// 添加根路由处理
app.get('/', (req, res) => {
    res.send('Heritage API Server is running');
});
// 添加在所有路由之后，但在 app.listen 之前
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ message: '服务器内部错误' });
});
app.listen(3000, '0.0.0.0', () => {
    console.log('🚀 服务已启动: http://localhost:3000');
});

// 添加删除评论接口
app.delete('/api/heritage/:id/comments/:commentId', async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const Heritage = mongoose.model('heritage');
        
        // 修改查询方式，确保正确匹配评论ID
        const updatedHeritage = await Heritage.findOneAndUpdate(
            { id: parseInt(id) },
            { 
                $pull: { 
                    comments: { 
                        _id: new mongoose.Types.ObjectId(commentId.toString()) 
                    } 
                } 
            },
            { new: true }
        );

        if (!updatedHeritage) {
            return res.status(404).json({
                status: 404,
                message: '未找到相关评论'
            });
        }

        // 确认删除是否成功
        const commentExists = updatedHeritage.comments.some(
            comment => comment._id.toString() === commentId
        );

        if (commentExists) {
            return res.status(500).json({
                status: 500,
                message: '评论删除失败'
            });
        }

        res.status(200).json({
            status: 200,
            message: '评论删除成功',
            data: updatedHeritage.comments
        });
    } catch (error) {
        console.error('删除评论失败:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 获取用户信息
app.get('/api/userinfo', auth, async (req, res) => {
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ message: '用户不存在' });
    res.json({
        status: 200,
        data: {
            username: user.username,
            avatar: user.avatar,
            bio: user.bio,
            address: user.address
        }
    });
});

// 更新用户信息
app.post('/api/userinfo', auth, async (req, res) => {
    const { username, avatar, bio, address } = req.body;
    const user = await User.findOneAndUpdate(
        { username: req.user.username },
        { username, avatar, bio, address },
        { new: true }
    );
    res.json({
        status: 200,
        data: {
            username: user.username,
            avatar: user.avatar,
            bio: user.bio,
            address: user.address
        }
    });
});