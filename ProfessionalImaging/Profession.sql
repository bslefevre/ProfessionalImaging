CREATE TABLE [dbo].[Profession]
(
	[Attendee_Id] INT NOT NULL, 
    [Professional] BIT NULL DEFAULT 0, 
    [SemiProfessional] BIT NULL DEFAULT 0, 
    [Retail] BIT NULL DEFAULT 0, 
    [Student] BIT NULL DEFAULT 0, 
    [Overig] BIT NULL DEFAULT 0, 
    CONSTRAINT [FK_Profession_ToAttendee] FOREIGN KEY (Attendee_Id) REFERENCES Attendee(Id)
	ON DELETE CASCADE, 
    CONSTRAINT [PK_Profession] PRIMARY KEY ([Attendee_Id])
)
