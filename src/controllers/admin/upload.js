export const postMeetingImageUpload = async (req, res) => {
  const file = req.file;
  return res.send(file.location);
};

export const postMembershipGradeImage = async (req, res) => {
  const file = req.file;
  return res.send(file.location);
};
