var express = require('express');
var router = express.Router();
let userSchema = require('../schemas/user')
let bcrypt = require('bcrypt')

module.exports = {
  getAllUsers: async function () {
      return userSchema.find({})
  },
  getUserById: async function (id) {
      return userSchema.findById(id).populate('role')
  },
  getUserByUsername: async function (username) {
      return userSchema.findOne({
          username: username
      })
  },
  createAnUser: async function (username, password, email, roleI) {

      let role = await roleSchema.findOne({
          name: roleI
      })
      if (role) {
          let newUser = new userSchema({
              username: username,
              password: password,
              email: email,
              role: role._id
          })
          return await newUser.save();

      } else {
          throw new Error('role khong ton tai')
      }

  },
  updateAnUser: async function (id, body) {
      let updatedUser = await this.getUserById(id);
      let allowFields = ["password", "email"];
      for (const key of Object.keys(body)) {
          if (allowFields.includes(key)) {
              updatedUser[key] = body[key]
          }
      }
      await updatedUser.save();
      return updatedUser;
  },
  deleteAnUser: async function (id) {
      let updatedUser = await userSchema.findByIdAndUpdate(
          id, {
          status: false
      }, { new: true }
      )
      return updatedUser;
  },
  checkLogin:async function(username,password){
      let user = await this.getUserByUsername(username);
      if (!user) {
          throw new Error("username user hoac password khong dung")
      } else {
          if (bcrypt.compareSync(password, user.password)) {
              return user._id;
          } else {
              throw new Error("username user hoac password khong dung")
          }
      }
  },
  changePassword: async function(user,oldpassword,newpassword){
      if(bcrypt.compareSync(user.password,oldpassword)){
          user.password = newpassword;
          return await user.save();
      }else{
          throw new Error("old password khong dung")
      }
  }
}

// Create User
router.post('/', async function(req, res, next) {
  try {
    let body = req.body;
    let newUser = new userSchema({
      username: body.username,
      password: body.password,
      email: body.email,
      fullName: body.fullName || "",
      avatarUrl: body.avatarUrl || "",
      status: body.status || false,
      role: body.role,
      loginCount: body.loginCount || 0
    });
    await newUser.save();
    res.status(200).send({
      success: true,
      data: newUser
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});



router.get('/', async function(req, res, next) {
  try {
    const { username, fullName, minLoginCount, maxLoginCount } = req.query;
    let filter = { isDeleted: false };

    if (username) filter.username = { $regex: username, $options: 'i' };
    if (fullName) filter.fullName = { $regex: fullName, $options: 'i' };
    if (minLoginCount) filter.loginCount = { $gte: parseInt(minLoginCount) };
    if (maxLoginCount) filter.loginCount = { ...filter.loginCount, $lte: parseInt(maxLoginCount) };

    let users = await userSchema.find(filter).populate('role');
    res.status(200).send({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let user = await userSchema.findById(id);
    if (user) {
      user.isDeleted = true;
      await user.save();
      res.status(200).send({
        success: true,
        data: user
      });
    } else {
      res.status(404).send({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

router.post("/verify", async function (req, res) {
  try {
    let { email, username } = req.body;
    if (!email || !username) throw new Error("Vui lòng cung cấp email và username");

    // Tìm user có email và username trùng khớp, chưa bị xóa mềm
    let user = await userSchema.findOne({ email, username, isDeleted: false });
    if (!user) throw new Error("Thông tin không hợp lệ");

    // Cập nhật status thành true
    user.status = true;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Xác minh thành công, status đã được cập nhật",
      data: user,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});


module.exports = router;