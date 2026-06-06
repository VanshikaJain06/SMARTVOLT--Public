use SmartVolt2;

DELIMITER //
create procedure CheckUserAccess(in email varchar(50), out access varchar(10))
begin
	if ((select count(*) from user where user_email = email) > 0) then
		select * from user where user_email = email; 
        set access = "user";
	else
		if ((select count(*) from company where com_email = email) > 0) then
			select * from company where com_email = email;
            set access = "company";
		else
			if (email = "ashwin.kumar@mca.christuniversity.in") then
				set access = "admin";
			else
				set access = "register";
			end if;
		end if;
	end if;
end //
DELIMITER ;
call CheckUserAccess('ashwin.kumarv@mca.christuniversity.in', @access);
select @access;


