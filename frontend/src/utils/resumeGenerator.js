import jsPDF from 'jspdf';

export const generateResume = (userData, profileData) => {
  const doc = new jsPDF();
  
  // Set up fonts and colors
  const primaryColor = [10, 102, 194]; // LinkedIn blue
  const textColor = [31, 41, 55]; // Dark gray
  const secondaryColor = [107, 114, 128]; // Medium gray
  
  let yPosition = 20;
  
  // Header - Name
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(userData.name || 'Your Name', 20, yPosition);
  
  yPosition += 8;
  
  // Current Position
  if (profileData?.currentPost) {
    doc.setFontSize(14);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    doc.text(profileData.currentPost, 20, yPosition);
    yPosition += 7;
  }
  
  // Contact Information
  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  doc.text(`Email: ${userData.email}`, 20, yPosition);
  yPosition += 5;
  doc.text(`Username: @${userData.username}`, 20, yPosition);
  yPosition += 10;
  
  // Line separator
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 10;
  
  // About / Bio Section
  if (profileData?.bio) {
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('ABOUT', 20, yPosition);
    yPosition += 7;
    
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'normal');
    const bioLines = doc.splitTextToSize(profileData.bio, 170);
    doc.text(bioLines, 20, yPosition);
    yPosition += (bioLines.length * 5) + 8;
  }
  
  // Work Experience Section
  if (profileData?.work && profileData.work.length > 0) {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('WORK EXPERIENCE', 20, yPosition);
    yPosition += 8;
    
    profileData.work.forEach((job, index) => {
      // Check if we need a new page
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'bold');
      doc.text(job.position, 20, yPosition);
      yPosition += 6;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(job.company, 20, yPosition);
      yPosition += 5;
      
      doc.setFontSize(10);
      doc.setTextColor(...secondaryColor);
      doc.text(`${job.years} ${job.years === 1 ? 'year' : 'years'}`, 20, yPosition);
      yPosition += 8;
    });
    
    yPosition += 5;
  }
  
  // Education Section
  if (profileData?.education && profileData.education.length > 0) {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('EDUCATION', 20, yPosition);
    yPosition += 8;
    
    profileData.education.forEach((edu, index) => {
      // Check if we need a new page
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'bold');
      doc.text(edu.degree, 20, yPosition);
      yPosition += 6;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`${edu.fieldOfStudy} - ${edu.school}`, 20, yPosition);
      yPosition += 8;
    });
  }
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    doc.text(
      `Generated from LinkedIn Clone - Page ${i} of ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  const fileName = `${userData.name?.replace(/\s+/g, '_') || 'Resume'}_Resume.pdf`;
  doc.save(fileName);
};
