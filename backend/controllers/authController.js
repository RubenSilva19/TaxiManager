// controllers/authController.js
import Admin from '../models/admin.js';
import User from '../models/user.js';

import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  try {
    const { name, email, password, cargo } = req.body;
    
    console.log('Tentando criar:', { name, email, cargo }); // DEBUG

    if (cargo === 'admin') {
      const existingUser = await Admin.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email já registado' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const admin = new Admin({ name, email, password: hashedPassword });

      // TRATAMENTO ESPECÍFICO DO SAVE
      try {
        await admin.save();
        console.log('✅ Admin criado:', admin._id);
      } catch (saveError) {
        console.error('❌ Erro ao salvar Admin:', saveError.message);
        return res.status(400).json({ 
          message: 'Erro ao criar admin', 
          error: saveError.message 
        });
      }

      res.status(201).json({
        success: true,
        message: 'Admin criado com sucesso',
        user: { id: admin._id, name, email }
      });

    } else {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email já registado' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ name, email, password: hashedPassword, cargo });

      // TRATAMENTO ESPECÍFICO DO SAVE
      try {
        await user.save();
        console.log('✅ User criado:', user._id);
      } catch (saveError) {
        console.error('❌ Erro ao salvar User:', saveError.message);
        return res.status(400).json({ 
          message: 'Erro ao criar user', 
          error: saveError.message 
        });
      }

      res.status(201).json({
        success: true,
        message: 'User criado com sucesso',
        user: { id: user._id, name, email, cargo }
      });
    }
  } catch (error) {
    console.error('❌ ERRO GERAL:', error.message);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

export const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        
        // Verifica se user existe
        let user = await User.findOne({ email });
        if (!user) {
            let admin = await Admin.findOne({ email });
            if (!admin) {
                return res.status(400).json({ message: 'Email ou password inválidos' });
            }
            user = admin;
            user.cargo = 'admin'; 
          }
        user.cargo = user.cargo || 'user';
        
        // Verifica password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email ou password inválidos' });
        }

        res.json({
            success: true,
            message: 'Login OK',
            user: { id: user._id, name: user.name, email, cargo: user.cargo }
        });
    } catch (error) {
      console.error('❌ ERRO GERAL:', error.message);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};
