const prisma = require('../lib/prisma');

const getProfile = async (req, res) => {
  let profile = await prisma.profile.findFirst();
  
  if (!profile) {
    return res.status(404).json({ error: 'Profil tidak ditemukan.' });
  }

  // Get social media
  const socialMedia = await prisma.socialMedia.findMany();

  res.json({ ...profile, socialMedia });
};

const updateProfile = async (req, res) => {
  const { name, profession, professionEn, bio, bioEn, aboutText, aboutTextEn, email, phone, location, cvUrl } = req.body;

  let profile = await prisma.profile.findFirst();

  const data = {
    name: name || profile?.name,
    profession: profession || profile?.profession,
    professionEn: professionEn !== undefined ? professionEn : profile?.professionEn,
    bio: bio !== undefined ? bio : profile?.bio,
    bioEn: bioEn !== undefined ? bioEn : profile?.bioEn,
    aboutText: aboutText !== undefined ? aboutText : profile?.aboutText,
    aboutTextEn: aboutTextEn !== undefined ? aboutTextEn : profile?.aboutTextEn,
    email: email !== undefined ? email : profile?.email,
    phone: phone !== undefined ? phone : profile?.phone,
    location: location !== undefined ? location : profile?.location,
    cvUrl: cvUrl !== undefined ? cvUrl : profile?.cvUrl,
  };

  if (profile) {
    profile = await prisma.profile.update({
      where: { id: profile.id },
      data,
    });
  } else {
    profile = await prisma.profile.create({ data });
  }

  res.json({ message: 'Profil berhasil diperbarui.', profile });
};

const updateProfileImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File gambar tidak disediakan.' });
  }

  const { imageType = 'profile' } = req.body;
  const imageUrl = req.file.path;

  let profile = await prisma.profile.findFirst();

  const updateData = imageType === 'about' 
    ? { aboutImage: imageUrl }
    : { profileImage: imageUrl };

  if (profile) {
    profile = await prisma.profile.update({
      where: { id: profile.id },
      data: updateData,
    });
  } else {
    profile = await prisma.profile.create({ 
      data: { 
        name: 'Irfan Sopandi',
        profession: 'Developer',
        bio: '',
        aboutText: '',
        ...updateData 
      } 
    });
  }

  res.json({ 
    message: 'Gambar berhasil diperbarui.',
    imageUrl,
    profile,
  });
};

const updateProfileCV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File CV tidak disediakan.' });
  }

  const cvUrl = req.file.path;

  let profile = await prisma.profile.findFirst();

  if (profile) {
    profile = await prisma.profile.update({
      where: { id: profile.id },
      data: { cvUrl },
    });
  } else {
    profile = await prisma.profile.create({
      data: {
        name: 'Irfan Sopandi',
        profession: 'Developer',
        bio: '',
        aboutText: '',
        cvUrl,
      }
    });
  }

  res.json({
    message: 'CV berhasil diunggah.',
    cvUrl,
    profile,
  });
};

module.exports = { getProfile, updateProfile, updateProfileImage, updateProfileCV };
