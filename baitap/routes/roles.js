var express = require('express');
var router = express.Router();
let roleSchema = require('../schemas/role')

router.get('/', async function(req, res, next) {
    try {
        let roles = await roleSchema.find({ isDeleted: false });
        res.status(200).send({
            success: true,
            data: roles
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: error.message
        });
    }
});
  

router.get('/:id', async function(req, res, next) {
    try {
        let id = req.params.id;
        let role = await roleSchema.findById(id);
        res.status(200).send({
            success: true,
            data: role
        });
    } catch (error) {
        res.status(404).send({
            success: false,
            message: error.message
        });
    }
});
  
  /* CREATE new role */
  router.post('/', async function(req, res, next) {
    try {
      let body = req.body;
      let newRole = new roleSchema(body);  // Tạo mới role
      await newRole.save();
      res.status(200).send({
        success: true,
        data: newRole
      });
    } catch (error) {
      res.status(404).send({
        success: false,
        message: error.message
      });
    }
  });
  
  
  /* SOFT DELETE role */
router.delete('/:id', async function(req, res, next) {
    try {
        let id = req.params.id;
        let role = await roleSchema.findById(id);
        if (role) {
            role.description = 'Deactivated';
            await role.save();
            res.status(200).send({
                success: true,
                data: role
            });
        } else {
        res.status(404).send({
            success: false,
            message: 'Role not found'
        });
        }
    } catch (error) {
        res.status(404).send({
            success: false,
            message: error.message
        });
    }
  });

  module.exports = router;