﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RareBooksService.Common.Models.Interfaces
{
    public interface IRegularBaseCategory
    {
        int Id { get; set; }
        int CategoryId { get; set; }
        string Name { get; set; }
    }
}
